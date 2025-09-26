const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { supabaseAnon } = require('../config/database');

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  try {
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
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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

// Get session status
router.get('/session-status', async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (!session_id) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    res.json({
      status: session.status,
      customer_email: session.customer_details?.email
    });

  } catch (error) {
    console.error('Error retrieving session status:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get subscription status
router.get('/subscription-status', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    // Find customer by email
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    if (customers.data.length === 0) {
      return res.json({ hasSubscription: false });
    }

    const customer = customers.data[0];

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1
    });

    if (subscriptions.data.length === 0) {
      return res.json({ hasSubscription: false });
    }

    const subscription = subscriptions.data[0];
    const product = await stripe.products.retrieve(subscription.items.data[0].price.product);

    res.json({
      hasSubscription: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        productName: product.name,
        productId: product.id
      }
    });

  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(400).json({ error: error.message });
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
        try {
          const { error: updateError } = await supabaseAnon
            .from('profiles')
            .update({
              subscription_status: 'active',
              subscription_type: productType,
              subscription_product: productName,
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);
            
          if (updateError) {
            console.error('Error updating user subscription:', updateError);
          } else {
            console.log('✅ User subscription updated successfully');
          }
        } catch (dbError) {
          console.error('Database error updating subscription:', dbError);
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
