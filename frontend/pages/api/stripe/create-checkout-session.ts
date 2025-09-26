import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// Middleware to authenticate user
const authenticateUser = async (req: NextApiRequest) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    throw new Error('No token provided')
  }

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error) {
    throw new Error('Invalid token')
  }

  return user
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Authenticate user
    const user = await authenticateUser(req)
    
    const { priceId } = req.body
    const userId = user.id
    const userEmail = user.email

    console.log('Creating checkout session for user:', userEmail, 'with price:', priceId)

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pricing?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: userEmail,
      metadata: {
        userId: userId
      },
      automatic_tax: { enabled: true },
    })

    console.log('Checkout session created:', session.id)

    res.json({
      clientSecret: session.client_secret
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(400).json({ error: error instanceof Error ? error.message : 'Internal server error' })
  }
}
