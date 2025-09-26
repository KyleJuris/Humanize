import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set Content-Type header
  res.setHeader('Content-Type', 'application/json')

  console.log('=== STRIPE HOSTED CHECKOUT API CALLED (PAGES ROUTER) ===')
  console.log('Method:', req.method)
  console.log('Body:', req.body)

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return res.status(200).json({ message: 'CORS preflight' })
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method)
    return res.status(405).json({ 
      error: 'Method not allowed',
      receivedMethod: req.method,
      expectedMethod: 'POST'
    })
  }

  try {
    const { priceId, success_url, cancel_url } = req.body
    
    // Validate required fields
    if (!priceId) {
      console.error('Missing priceId in request body')
      return res.status(400).json({ 
        error: 'priceId is required' 
      })
    }
    
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your-stripe-secret-key')) {
      console.error('STRIPE_SECRET_KEY is not properly configured')
      return res.status(500).json({ 
        error: 'Stripe configuration error. Please contact support.' 
      })
    }
    
    console.log('Creating Stripe checkout session with priceId:', priceId)
    
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
    })
    
    console.log('Stripe checkout session created:', session.id)
    
    // Return success response
    return res.status(200).json({
      id: session.id,
      url: session.url
    })
    
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    
    // Always return valid JSON
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    return res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    })
  }
}
