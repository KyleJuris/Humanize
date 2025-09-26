const express = require('express');
const router = express.Router();
const { getStripe } = require('../lib/stripe');

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  try {
    // Always allow OPTIONS requests to pass through
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Load database config inside the middleware
    const { supabaseAnon } = require('../config/database');
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
function isValidUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

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

// Handle GET requests to create-checkout-session (should be POST)
router.get('/create-checkout-session', (req, res) => {
  res.status(405).json({
    error: 'Method Not Allowed',
    message: 'This endpoint only accepts POST requests. Use POST method to create a checkout session.',
    method: req.method,
    allowedMethods: ['POST'],
    timestamp: new Date().toISOString()
  });
});

// Create hosted checkout session
router.post('/create-checkout-session', authenticateUser, async (req, res) => {
  try {
    // Debug logging to check request body
    console.log('=== STRIPE HOSTED CHECKOUT DEBUG ===');
    console.log('Request headers:', req.headers);
    console.log('Request body type:', typeof req.body);
    console.log('Request body:', req.body);
    console.log('Content-Type header:', req.headers['content-type']);
    
    // Safe fallback parse in case body arrived as string/Buffer
    let requestBody = req.body;
    if (typeof requestBody === 'string') {
      try {
        requestBody = JSON.parse(requestBody);
        console.log('✅ Parsed string body to JSON:', requestBody);
      } catch (parseError) {
        console.error('❌ Failed to parse string body as JSON:', parseError);
        return res.status(400).json({ 
          error: 'Invalid JSON in request body',
          details: parseError.message
        });
      }
    } else if (Buffer.isBuffer(requestBody)) {
      try {
        const bodyString = requestBody.toString('utf8');
        requestBody = JSON.parse(bodyString);
        console.log('✅ Parsed Buffer body to JSON:', requestBody);
      } catch (parseError) {
        console.error('❌ Failed to parse Buffer body as JSON:', parseError);
        return res.status(400).json({ 
          error: 'Invalid JSON in request body',
          details: parseError.message
        });
      }
    }
    
    const { priceId, customerEmail, success_url, cancel_url } = requestBody;
    const userId = req.user.id;
    const userEmail = customerEmail || req.user.email;

    console.log('=== STRIPE HOSTED CHECKOUT API CALLED (BACKEND) ===');
    console.log('User:', userEmail, 'PriceId:', priceId);

    // Validate required fields
    if (!priceId) {
      console.error('Missing priceId in request body');
      return res.status(400).json({ 
        error: 'priceId is required',
        receivedData: { priceId, customerEmail, success_url, cancel_url }
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

    // Validate URLs if provided
    if (success_url && !isValidUrl(success_url)) {
      console.error('Invalid success_url:', success_url);
      return res.status(400).json({ 
        error: 'Invalid success_url format. Must be a valid HTTP/HTTPS URL',
        receivedSuccessUrl: success_url
      });
    }

    if (cancel_url && !isValidUrl(cancel_url)) {
      console.error('Invalid cancel_url:', cancel_url);
      return res.status(400).json({ 
        error: 'Invalid cancel_url format. Must be a valid HTTP/HTTPS URL',
        receivedCancelUrl: cancel_url
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
    if (success_url) console.log('✅ Success URL validation passed:', success_url);
    if (cancel_url) console.log('✅ Cancel URL validation passed:', cancel_url);

    const stripe = getStripe();
    const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const productInfo = VALID_PRODUCTS[priceId];

    console.log('Creating Stripe checkout session with priceId:', priceId, 'for product:', productInfo.name);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      success_url: success_url || `${siteUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${siteUrl}/billing/cancel`,
      metadata: {
        userId: userId,
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
      environment: envValidation.environment,
      validation: {
        priceIdValid: true,
        environmentValid: true,
        urlsValid: {
          success_url: success_url ? isValidUrl(success_url) : 'default',
          cancel_url: cancel_url ? isValidUrl(cancel_url) : 'default'
        }
      }
    });

  } catch (error) {
    console.error('Error creating hosted checkout session:', error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Webhook route is handled directly in server.js with raw body parsing

module.exports = router;
