const express = require('express');
const router = express.Router();
const Stripe = require('stripe');

// Handle preflight OPTIONS requests for CORS
router.options('*', (req, res) => {
  console.log('🔍 Stripe route OPTIONS preflight request');
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  res.status(200).end();
});

// Try to load database config, but don't fail if it's not available
let supabase, supabaseAnon;
try {
  const dbConfig = require('../config/database');
  supabase = dbConfig.supabase;
  supabaseAnon = dbConfig.supabaseAnon;
  console.log('✅ Database config loaded for stripe routes');
} catch (error) {
  console.log('⚠️ Database config not available for stripe routes:', error.message);
  supabase = null;
  supabaseAnon = null;
}

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  try {
    // Let preflight requests pass through
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    
    if (!supabaseAnon) {
      return res.status(503).json({ error: 'Authentication service unavailable' });
    }

    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error } = await supabaseAnon.auth.getUser(token);

    if (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Initialize Stripe with secret key
const stripe = (() => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY not provided');
    }
    const StripeLib = require('stripe');
    const client = new StripeLib(process.env.STRIPE_SECRET_KEY, {
      // Pin if you prefer: apiVersion: '2024-06-20'
    });
    console.log('✅ Stripe client initialized');
    return client;
  } catch (error) {
    console.error('❌ Failed to initialize Stripe client:', error.message);
    return null;
  }
})();

// Allowed plan keys (lookup_key values)
const ALLOWED_LOOKUP_KEYS = new Set([
  'humanizer_pro_monthly',
  'humanizer_ultra_monthly'
]);

// Resolve a price from either priceId or lookup_key
async function resolvePrice({ priceId, plan, lookup_key }) {
  if (!stripe) throw new Error('Stripe not initialized');

  // Back-compat: accept a known priceId (existing behavior)
  if (priceId) {
    if (!isValidPriceId(priceId)) {
      throw new Error('Invalid priceId provided');
    }
    return { 
      priceId, 
      planLookupKey: null, 
      productName: VALID_PRODUCTS[priceId]?.name || null,
      productType: VALID_PRODUCTS[priceId]?.type || null
    };
  }

  // Prefer explicit plan or lookup_key
  const key = plan || lookup_key;
  if (!key) throw new Error('Provide either plan or priceId');
  if (!ALLOWED_LOOKUP_KEYS.has(key)) {
    throw new Error('Invalid plan key');
  }

  // Fetch the current active price by lookup_key
  const list = await stripe.prices.list({
    lookup_keys: [key],
    active: true,
    expand: ['data.product'] // so we can read product.name
  });
  const p = list.data[0];
  if (!p) throw new Error(`No active price found for lookup_key=${key}`);

  // Derive product type from lookup key
  const productType = key === 'humanizer_pro_monthly' ? 'pro' : 
                     key === 'humanizer_ultra_monthly' ? 'ultra' : null;

  const resolved = {
    priceId: p.id,
    planLookupKey: p.lookup_key || key,
    productName: typeof p.product === 'object' ? p.product.name : null,
    productType: productType
  };
  return resolved;
}

// Valid product configurations
const VALID_PRODUCTS = {
  'price_1SBQPvIxRGF259ZE76mXrkA4': {
    productId: 'prod_T7fl4RTFxDw5aE',
    name: 'Humanizer Pro',
    type: 'pro'
  },
  'price_1SBQOpIxRGF259ZEXgH7kuYV': {
    productId: 'prod_T7fkQX8Kqwr76F',
    name: 'Humanizer Ultra',
    type: 'ultra'
  }
};

// Validation functions
function isValidPriceId(priceId) {
  return priceId in VALID_PRODUCTS;
}

function validateEnvironment(secretKey) {
  if (!secretKey) {
    return { isValid: false, environment: 'unknown', error: 'No secret key provided' };
  }
  
  if (secretKey.includes('your-stripe-secret-key')) {
    return { isValid: false, environment: 'unknown', error: 'Placeholder secret key detected' };
  }
  
  if (secretKey.startsWith('sk_test_')) {
    return { isValid: true, environment: 'test' };
  } else if (secretKey.startsWith('sk_live_')) {
    return { isValid: true, environment: 'live' };
  } else {
    return { isValid: false, environment: 'unknown', error: 'Invalid secret key format' };
  }
}

// Create checkout session - MAIN ENDPOINT FOR FRONTEND
router.post('/checkout-session', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    // Normalize request body to object
    let body = req.body ?? {};
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch {} }
    if (Buffer.isBuffer(body))    { try { body = JSON.parse(body.toString('utf8')); } catch {} }

    const { priceId, plan, lookup_key, success_url, cancel_url } = body || {};

    if (!stripe) {
      return res.status(503).json({ error: 'Stripe service unavailable' });
    }

    // Resolve price by lookup_key or accept known priceId
    let resolved;
    try {
      resolved = await resolvePrice({ priceId, plan, lookup_key });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://humanize-pro.vercel.app';
    const successURL = success_url || `${siteUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelURL  = cancel_url  || `${siteUrl}/billing/cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: resolved.priceId, quantity: 1 }],
      customer_email: userEmail,
      success_url: successURL,
      cancel_url: cancelURL,
      metadata: {
        userId: String(userId),
        userEmail: String(userEmail),
        plan_lookup_key: resolved.planLookupKey || '',   // <— include for downstream logic
        product_name: resolved.productName || '',
        product_type: resolved.productType || '',        // <— CRITICAL: needed by webhook
      },
      automatic_tax: { enabled: true },
    });

    return res.json({
      id: session.id,
      url: session.url,
      product: {
        name: resolved.productName,
        priceId: resolved.priceId,
        planLookupKey: resolved.planLookupKey
      }
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Test route to verify stripe routes are working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Stripe routes are working', 
    timestamp: new Date().toISOString(),
    stripeAvailable: !!stripe,
    databaseAvailable: !!supabase
  });
});

// Get session status
router.get('/session-status', async (req, res) => {
  try {
    console.log('🔍 Session status endpoint called with query:', req.query);
    
    if (!stripe) {
      return res.status(503).json({ 
        error: 'Stripe service unavailable',
        message: 'Stripe not initialized'
      });
    }

    const { session_id } = req.query;
    
    if (!session_id) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    console.log('🔍 Retrieving session from Stripe:', session_id);
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log('🔍 Session retrieved:', { id: session.id, status: session.status });

    res.json({
      message: 'Session status retrieved successfully',
      status: session.status,               // 'open' | 'complete' | 'expired'
      payment_status: session.payment_status, // 'paid' | 'unpaid' | 'no_payment_required'
      customer_email: session.customer_details?.email,
      plan_lookup_key: session.metadata?.plan_lookup_key || null,   // <— added
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error retrieving session status:', error);
    res.status(400).json({ 
      error: error.message,
      message: 'Error occurred'
    });
  }
});

// GET /api/stripe/subscription-status
router.get('/subscription-status', authenticateUser, async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        error: 'Stripe service unavailable',
        message: 'Stripe not initialized'
      });
    }

    const userEmail = req.user.email;

    // 1) Find Stripe customer by email
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    if (customers.data.length === 0) {
      return res.json({ hasSubscription: false, message: 'No customer found' });
    }
    const customer = customers.data[0];

    // 2) Get active subscription(s) with **shallow** expands (avoid product depth)
    const subs = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
      expand: ['data.items.data.price'] // keep it shallow; no ".product"
    });

    if (subs.data.length === 0) {
      return res.json({ hasSubscription: false, message: 'No active subscription found' });
    }

    const sub = subs.data[0];
    const firstItem = sub.items.data[0];
    const price = firstItem?.price;

    // Only include fields you actually use
    return res.json({
      hasSubscription: true,
      subscription: {
        id: sub.id,
        status: sub.status,
        currentPeriodEnd: sub.current_period_end,
        planLookupKey: price?.lookup_key || null
      }
    });

  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(400).json({
      error: error.type || 'StripeError',
      message: error.message || 'Error occurred'
    });
  }
});

// Method Not Allowed for GET on create-checkout-session (hosted)
router.get('/create-checkout-session', (req, res) => {
  return res.status(405).json({ error: 'Method Not Allowed', expected: 'POST' });
});

// Create Checkout Session (Hosted) - Alternative endpoint
router.post('/create-checkout-session', authenticateUser, async (req, res) => {
  try {
    // Normalize the body
    let body = req.body ?? {};
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch {} }
    if (Buffer.isBuffer(body))    { try { body = JSON.parse(body.toString('utf8')); } catch {} }

    const { priceId, plan, lookup_key, success_url, cancel_url } = body || {};

    if (!stripe) {
      return res.status(503).json({ error: 'Stripe service unavailable' });
    }

    // Resolve price by lookup_key or accept known priceId
    let resolved;
    try {
      resolved = await resolvePrice({ priceId, plan, lookup_key });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const defaultSite = process.env.NEXT_PUBLIC_SITE_URL || process.env.FRONTEND_URL || 'https://humanize-pro.vercel.app';
    const successURL = success_url || `${defaultSite}/billing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelURL  = cancel_url  || `${defaultSite}/billing/cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: resolved.priceId, quantity: 1 }],
      success_url: successURL,
      cancel_url: cancelURL,
      metadata: {
        userId: String(req.user?.id || req.user?.sub || ''),
        userEmail: String(req.user?.email || ''),           // Fix: use userEmail not email
        plan_lookup_key: resolved.planLookupKey || '',
        product_name: resolved.productName || '',
        product_type: resolved.productType || ''            // <— CRITICAL: needed by webhook
      }
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('[stripe-hosted] error:', err);
    const status = (err && (err.statusCode || err.status)) || 500;
    return res.status(status).json({ error: err.message || 'Internal Server Error' });
  }
});

// Cancel subscription
router.post('/cancel-subscription', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    // Find customer by email
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    if (customers.data.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const customer = customers.data[0];

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1
    });

    if (subscriptions.data.length === 0) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    const subscription = subscriptions.data[0];

    // Cancel subscription
    const canceledSubscription = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true
    });

    res.json({
      message: 'Subscription will be canceled at the end of the current period',
      subscription: {
        id: canceledSubscription.id,
        status: canceledSubscription.status,
        cancelAtPeriodEnd: canceledSubscription.cancel_at_period_end,
        currentPeriodEnd: canceledSubscription.current_period_end
      }
    });

  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
