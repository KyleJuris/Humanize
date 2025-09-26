const express = require('express');
const router = express.Router();
const { getStripe } = require('../lib/stripe');
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

// Stripe price IDs for the products
const PRICE_IDS = {
  pro: 'price_1SAkpqIxRGF259ZEZoW96l7pPo5NkDfG2OiKCSYV0ieCIlObHJgVNnOg93EmPkYH4HzOm0M5q8Q8eEgVSO74gxkC00Hw38Q2yy', // Pro $19.99/month
  ultra: 'price_1SAkpqIxRGF259ZEZoW96l7pPo5NkDfG2OiKCSYV0ieCIlObHJgVNnOg93EmPkYH4HzOm0M5q8Q8eEgVSO74gxkC00Hw38Q2yy' // Ultra $39.99/month - You'll need to create this in Stripe
};

// Create hosted checkout session
router.post('/create-checkout-session', authenticateUser, async (req, res) => {
  try {
    const { priceId, customerEmail } = req.body;
    const userId = req.user.id;
    const userEmail = customerEmail || req.user.email;

    console.log('Creating hosted checkout session for user:', userEmail, 'with price:', priceId);

    const stripe = getStripe();
    const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

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
        userId: userId
      },
      automatic_tax: { enabled: true },
    });

    console.log('Hosted checkout session created:', session.id);

    res.json({
      url: session.url
    });

  } catch (error) {
    console.error('Error creating hosted checkout session:', error);
    res.status(400).json({ error: error.message });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`Received webhook event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log(`Checkout session completed: ${session.id}`);
        // TODO: Update user subscription status in database
        await updateUserSubscriptionStatus(session.customer_email, 'active');
        break;

      case 'customer.subscription.updated':
        const subscription = event.data.object;
        console.log(`Customer subscription updated: ${subscription.id}`);
        // TODO: Update user subscription status in database
        await updateUserSubscriptionStatus(subscription.customer, subscription.status);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        console.log(`Customer subscription deleted: ${deletedSubscription.id}`);
        // TODO: Update user subscription status in database
        await updateUserSubscriptionStatus(deletedSubscription.customer, 'cancelled');
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Placeholder function to update user subscription status in database
async function updateUserSubscriptionStatus(customerIdentifier, status) {
  try {
    console.log(`Updating subscription status for ${customerIdentifier} to ${status}`);
    // TODO: Implement database update logic
    // This would typically update a user's subscription status in your database
    // based on the customer email or customer ID from Stripe
  } catch (error) {
    console.error('Error updating subscription status:', error);
  }
}

module.exports = router;
