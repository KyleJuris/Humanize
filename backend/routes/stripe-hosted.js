const express = require('express');
const { authenticateUser } = require('../middleware/auth');      // <-- ensure this path points to your auth middleware
const { getStripe } = require('../lib/stripe');                  // <-- ensure this path points to your Stripe init
const router = express.Router();

/**
 * Extra safety: add a local JSON parser for this router.
 * This guarantees req.body is parsed even if global order slips.
 */
router.use(express.json({ type: ['application/json', 'application/*+json'] }));

/**
 * Method Not Allowed for GET on create-checkout-session.
 * Prevents confusing 404s when developers hit the URL in the browser.
 */
router.get('/create-checkout-session', (req, res) => {
  return res.status(405).json({ error: 'Method Not Allowed', expected: 'POST' });
});

/**
 * Create Checkout Session (Hosted)
 * Requires Authorization: Bearer <token>.
 * Body must be JSON: { priceId: string, success_url?: string, cancel_url?: string }
 */
router.post('/create-checkout-session', authenticateUser, async (req, res) => {
  try {
    // ---- Instrumentation: keep temporarily and then remove ----
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

    const stripe = getStripe();
    // Compose absolute URLs if not provided; you can set these via env if preferred:
    const defaultSite = process.env.NEXT_PUBLIC_SITE_URL || process.env.FRONTEND_URL;
    const successURL = success_url || `${defaultSite}/billing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelURL  = cancel_url  || `${defaultSite}/billing/cancel`;

    // Create session; ensure mode matches your Price type (subscription vs payment)
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',                 // or 'payment' for one-time prices
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successURL,
      cancel_url: cancelURL,
      // Attach your user identity for reconciliation in webhook:
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

module.exports = router;