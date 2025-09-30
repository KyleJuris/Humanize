const express = require('express');
const router = express.Router();

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

module.exports = router;
