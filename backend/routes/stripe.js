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
let stripe;
try {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY not provided');
  }
  stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  console.log('✅ Stripe client initialized');
} catch (error) {
  console.error('❌ Failed to initialize Stripe client:', error.message);
  stripe = null;
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
    const { priceId } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    console.log('=== STRIPE CHECKOUT SESSION CREATION ===');
    console.log('User:', userEmail, 'PriceId:', priceId);

    // Validate required fields
    if (!priceId) {
      console.error('Missing priceId in request body');
      return res.status(400).json({ 
        error: 'priceId is required',
        receivedData: { priceId }
      });
    }

    // Validate priceId against known products
    if (!isValidPriceId(priceId)) {
      console.error('Invalid priceId:', priceId);
      return res.status(400).json({ 
        error: 'Invalid priceId provided',
        receivedPriceId: priceId,
        validPriceIds: Object.keys(VALID_PRODUCTS),
        validProducts: Object.values(VALID_PRODUCTS).map(p => ({ name: p.name, priceId: Object.keys(VALID_PRODUCTS).find(k => VALID_PRODUCTS[k] === p) }))
      });
    }

    // Validate Stripe environment
    const envValidation = validateEnvironment(process.env.STRIPE_SECRET_KEY);
    if (!envValidation.isValid) {
      console.error('Stripe environment validation failed:', envValidation.error);
      return res.status(500).json({ 
        error: 'Stripe configuration error',
        details: envValidation.error,
        environment: envValidation.environment
      });
    }

    console.log('✅ Environment validation passed:', envValidation.environment);
    console.log('✅ PriceId validation passed:', priceId, '- Product:', VALID_PRODUCTS[priceId].name);

    const productInfo = VALID_PRODUCTS[priceId];
    const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://humanize-pro.vercel.app';

    console.log('Creating Stripe checkout session with priceId:', priceId, 'for product:', productInfo.name);

    // Create Stripe checkout session with absolute URLs
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      success_url: `${siteUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/billing/cancel`,
      metadata: {
        userId: userId, // Stable user identifier
        userEmail: userEmail,
        product_name: productInfo.name,
        product_type: productInfo.type,
        product_id: productInfo.productId,
        environment: envValidation.environment
      },
      automatic_tax: { enabled: true },
    });

    console.log('Stripe checkout session created:', session.id);

    res.json({
      id: session.id,
      url: session.url,
      product: {
        name: productInfo.name,
        type: productInfo.type,
        priceId: priceId,
        productId: productInfo.productId
      },
      environment: envValidation.environment
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
      status: session.status,
      customer_email: session.customer_details?.email,
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

// Get subscription status
router.get('/subscription-status', authenticateUser, async (req, res) => {
  try {
    console.log('🔍 Getting subscription status for user:', req.user.email);
    
    if (!stripe) {
      return res.status(503).json({ 
        error: 'Stripe service unavailable',
        message: 'Stripe not initialized'
      });
    }

    const userId = req.user.id;
    const userEmail = req.user.email;

    // Find customer by email
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    if (customers.data.length === 0) {
      console.log('🔍 No customer found for email:', userEmail);
      return res.json({ 
        hasSubscription: false,
        message: 'No customer found'
      });
    }

    const customer = customers.data[0];
    console.log('🔍 Found customer:', customer.id);

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1
    });

    if (subscriptions.data.length === 0) {
      console.log('🔍 No active subscriptions found for customer:', customer.id);
      return res.json({ 
        hasSubscription: false,
        message: 'No active subscription found'
      });
    }

    const subscription = subscriptions.data[0];
    console.log('🔍 Found active subscription:', subscription.id);

    const product = await stripe.products.retrieve(subscription.items.data[0].price.product);

    res.json({
      hasSubscription: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        productName: product.name,
        productId: product.id
      },
      message: 'Subscription status retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(400).json({ 
      error: error.message,
      message: 'Error occurred'
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
    console.log('[stripe-hosted] CT:', req.headers['content-type']);
    console.log('[stripe-hosted] typeof req.body:', typeof req.body);

    // Normalize the body to an object even if a proxy left it as string/Buffer.
    let body = req.body ?? {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { /* ignore */ }
    }
    if (Buffer.isBuffer(body)) {
      try { body = JSON.parse(body.toString('utf8')); } catch { /* ignore */ }
    }

    const { priceId, success_url, cancel_url } = body || {};
    if (!priceId) {
      return res.status(400).json({ error: 'Missing priceId' });
    }

    if (!stripe) {
      return res.status(503).json({ error: 'Stripe service unavailable' });
    }

    // Compose absolute URLs if not provided
    const defaultSite = process.env.NEXT_PUBLIC_SITE_URL || process.env.FRONTEND_URL || 'https://humanize-pro.vercel.app';
    const successURL = success_url || `${defaultSite}/billing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelURL = cancel_url || `${defaultSite}/billing/cancel`;

    // Create session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successURL,
      cancel_url: cancelURL,
      // Attach user identity for reconciliation in webhook
      metadata: {
        userId: String(req.user?.id || req.user?.sub || ''),
        email: String(req.user?.email || ''),
        planPriceId: priceId
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

// Webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Received webhook event:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('=== CHECKOUT SESSION COMPLETED ===');
        console.log('Session ID:', session.id);
        console.log('Customer Email:', session.customer_details?.email);
        console.log('Metadata:', session.metadata);
        
        // Extract user information from metadata
        const userId = session.metadata?.userId;
        const userEmail = session.metadata?.userEmail;
        const productName = session.metadata?.product_name;
        const productType = session.metadata?.product_type;
        
        if (!userId || !userEmail) {
          console.error('Missing user information in session metadata');
          break;
        }
        
        console.log('Updating user subscription in database...');
        console.log('User ID:', userId, 'Email:', userEmail, 'Product:', productName);
        
        // Update user subscription status in Supabase (idempotent)
        if (supabase) {
          try {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                subscription_status: 'active',
                subscription_type: productType,
                subscription_product: productName,
                stripe_customer_id: session.customer,
                stripe_subscription_id: session.subscription,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', userId);
              
            if (updateError) {
              console.error('Error updating user subscription:', updateError);
            } else {
              console.log('✅ User subscription updated successfully');
            }
          } catch (dbError) {
            console.error('Database error updating subscription:', dbError);
          }
        } else {
          console.log('⚠️ Database not available, skipping subscription update');
        }
        
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        console.log('Payment succeeded for invoice:', invoice.id);
        
        // Update user subscription status in your database
        // You can add database logic here to update user's subscription status
        
        break;

      case 'customer.subscription.updated':
        const subscription = event.data.object;
        console.log('Subscription updated:', subscription.id, 'Status:', subscription.status);
        
        // Update user subscription status in your database
        // You can add database logic here to update user's subscription status
        
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        console.log('Subscription deleted:', deletedSubscription.id);
        
        // Update user subscription status in your database
        // You can add database logic here to remove user's subscription
        
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
