import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

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
}

// Validation functions
function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

function isValidPriceId(priceId: string): boolean {
  return priceId in VALID_PRODUCTS
}

function validateEnvironment(secretKey: string): { isValid: boolean; environment: string; error?: string } {
  if (!secretKey) {
    return { isValid: false, environment: 'unknown', error: 'No secret key provided' }
  }
  
  if (secretKey.includes('your-stripe-secret-key')) {
    return { isValid: false, environment: 'unknown', error: 'Placeholder secret key detected' }
  }
  
  // Check if it's a test key (starts with sk_test_) or live key (starts with sk_live_)
  if (secretKey.startsWith('sk_test_')) {
    return { isValid: true, environment: 'test' }
  } else if (secretKey.startsWith('sk_live_')) {
    return { isValid: true, environment: 'live' }
  } else {
    return { isValid: false, environment: 'unknown', error: 'Invalid secret key format' }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set Content-Type header first
  res.setHeader('Content-Type', 'application/json')

  console.log('=== STRIPE HOSTED CHECKOUT API CALLED (PAGES ROUTER) ===')
  console.log('Method:', req.method)
  console.log('URL:', req.url)
  console.log('Headers:', req.headers)
  console.log('Body:', req.body)

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return res.status(200).json({ message: 'CORS preflight' })
  }

  // Only allow POST method - return 405 for any other method
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method)
    return res.status(405).json({ 
      error: 'Method not allowed',
      receivedMethod: req.method,
      expectedMethod: 'POST',
      allowedMethods: ['POST', 'OPTIONS']
    })
  }

  try {
    const { priceId, success_url, cancel_url } = req.body
    
    // Validate required fields
    if (!priceId) {
      console.error('Missing priceId in request body')
      return res.status(400).json({ 
        error: 'priceId is required',
        receivedData: { priceId, success_url, cancel_url }
      })
    }

    // Validate priceId against known products
    if (!isValidPriceId(priceId)) {
      console.error('Invalid priceId:', priceId)
      return res.status(400).json({ 
        error: 'Invalid priceId provided',
        receivedPriceId: priceId,
        validPriceIds: Object.keys(VALID_PRODUCTS),
        validProducts: Object.values(VALID_PRODUCTS).map(p => ({ name: p.name, priceId: Object.keys(VALID_PRODUCTS).find(k => VALID_PRODUCTS[k] === p) }))
      })
    }

    // Validate URLs if provided
    if (success_url && !isValidUrl(success_url)) {
      console.error('Invalid success_url:', success_url)
      return res.status(400).json({ 
        error: 'Invalid success_url format. Must be a valid HTTP/HTTPS URL',
        receivedSuccessUrl: success_url
      })
    }

    if (cancel_url && !isValidUrl(cancel_url)) {
      console.error('Invalid cancel_url:', cancel_url)
      return res.status(400).json({ 
        error: 'Invalid cancel_url format. Must be a valid HTTP/HTTPS URL',
        receivedCancelUrl: cancel_url
      })
    }

    // Validate Stripe environment
    const envValidation = validateEnvironment(process.env.STRIPE_SECRET_KEY!)
    if (!envValidation.isValid) {
      console.error('Stripe environment validation failed:', envValidation.error)
      return res.status(500).json({ 
        error: 'Stripe configuration error',
        details: envValidation.error,
        environment: envValidation.environment
      })
    }

    console.log('✅ Environment validation passed:', envValidation.environment)
    console.log('✅ PriceId validation passed:', priceId, '- Product:', VALID_PRODUCTS[priceId].name)
    if (success_url) console.log('✅ Success URL validation passed:', success_url)
    if (cancel_url) console.log('✅ Cancel URL validation passed:', cancel_url)

    // Initialize Stripe only when needed
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    })
    
    const productInfo = VALID_PRODUCTS[priceId]
    console.log('Creating Stripe checkout session with priceId:', priceId, 'for product:', productInfo.name)
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: success_url || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/billing/cancel`,
      automatic_tax: { enabled: true },
      metadata: {
        product_name: productInfo.name,
        product_type: productInfo.type,
        product_id: productInfo.productId,
        environment: envValidation.environment
      },
    })
    
    console.log('Stripe checkout session created:', session.id)
    
    // Return success response with validation info
    return res.status(200).json({
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
    })
    
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    
    // Always return valid JSON with proper error handling
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    // Ensure we always return JSON, even if there was an error
    try {
      return res.status(500).json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      })
    } catch (jsonError) {
      // Fallback if JSON serialization fails
      console.error('Failed to serialize error response:', jsonError)
      res.status(500).end(JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to serialize error response'
      }))
    }
  }
}
