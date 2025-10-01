const express = require('express');
const router = express.Router();

// Try to load database config for authentication
let supabaseAnon;
try {
  const dbConfig = require('../config/database');
  supabaseAnon = dbConfig.supabaseAnon;
  console.log('✅ Database config loaded for stripe-clean routes');
} catch (error) {
  console.log('⚠️ Database config not available for stripe-clean routes:', error.message);
  supabaseAnon = null;
}

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  try {
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
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  console.log('✅ Stripe client initialized in clean routes');
} catch (error) {
  console.error('❌ Failed to initialize Stripe client:', error.message);
  stripe = null;
}

// Test route to verify stripe routes are working
router.get('/test', (req, res) => {
  console.log('🧪 CLEAN ROUTES: /test endpoint reached');
  res.json({ 
    message: 'CLEAN STRIPE ROUTES: /test endpoint working!',
    timestamp: new Date().toISOString(),
    stripeAvailable: !!stripe,
    method: req.method,
    url: req.originalUrl
  });
});

// Get session status
router.get('/session-status', async (req, res) => {
  try {
    console.log('🧪 CLEAN ROUTES: /session-status endpoint reached');
    
    if (!stripe) {
      return res.status(503).json({ 
        error: 'Stripe service unavailable',
        message: 'CLEAN STRIPE ROUTES: Stripe not initialized'
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
      message: 'CLEAN STRIPE ROUTES: Session status retrieved successfully',
      status: session.status,
      customer_email: session.customer_details?.email,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error retrieving session status:', error);
    res.status(400).json({ 
      error: error.message,
      message: 'CLEAN STRIPE ROUTES: Error occurred'
    });
  }
});

// Get subscription status
router.get('/subscription-status', authenticateUser, async (req, res) => {
  try {
    console.log('🧪 CLEAN ROUTES: /subscription-status endpoint reached');
    
    if (!stripe) {
      return res.status(503).json({ 
        error: 'Stripe service unavailable',
        message: 'CLEAN STRIPE ROUTES: Stripe not initialized'
      });
    }

    const userId = req.user.id;
    const userEmail = req.user.email;

    console.log('🔍 Getting subscription status for user:', userEmail);

    // Find customer by email
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    if (customers.data.length === 0) {
      console.log('🔍 No customer found for email:', userEmail);
      return res.json({ 
        hasSubscription: false,
        message: 'CLEAN STRIPE ROUTES: No customer found'
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
        message: 'CLEAN STRIPE ROUTES: No active subscription found'
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
      message: 'CLEAN STRIPE ROUTES: Subscription status retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(400).json({ 
      error: error.message,
      message: 'CLEAN STRIPE ROUTES: Error occurred'
    });
  }
});

module.exports = router;
