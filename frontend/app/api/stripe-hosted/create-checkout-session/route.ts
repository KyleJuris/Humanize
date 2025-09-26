import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  console.log('=== STRIPE HOSTED CHECKOUT API CALLED (APP ROUTER) ===')
  
  try {
    // Parse the request body
    const body = await request.json()
    console.log('Request body:', body)
    
    const { priceId } = body
    
    // Validate required fields
    if (!priceId) {
      console.error('Missing priceId in request body')
      return NextResponse.json(
        { error: 'priceId is required' },
        { status: 400 }
      )
    }
    
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your-stripe-secret-key')) {
      console.error('STRIPE_SECRET_KEY is not properly configured')
      return NextResponse.json(
        { error: 'Stripe configuration error. Please contact support.' },
        { status: 500 }
      )
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
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/billing/cancel`,
      automatic_tax: { enabled: true },
    })
    
    console.log('Stripe checkout session created:', session.id)
    
    // Return success response
    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })
    
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    
    // Always return valid JSON
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  )
}
