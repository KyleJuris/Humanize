import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function GET(request: NextRequest) {
  console.log('=== STRIPE SESSION STATUS API CALLED (APP ROUTER) ===')
  
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    
    console.log('Session ID:', sessionId)
    
    if (!sessionId) {
      console.error('Missing session_id parameter')
      return NextResponse.json(
        { error: 'session_id is required' },
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
    
    console.log('Retrieving Stripe session:', sessionId)
    
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    console.log('Session retrieved:', session.status)
    
    // Return session status
    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email,
      sessionId: session.id
    })
    
  } catch (error) {
    console.error('Error retrieving Stripe session:', error)
    
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
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET.' },
    { status: 405 }
  )
}
