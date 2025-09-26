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
    const { priceId, customerEmail } = req.body
    const userId = user.id
    const userEmail = customerEmail || user.email

    console.log('Creating hosted checkout session for user:', userEmail, 'with price:', priceId)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'

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
    })

    console.log('Hosted checkout session created:', session.id)

    res.json({
      url: session.url
    })

  } catch (error) {
    console.error('Error creating hosted checkout session:', error)
    res.status(400).json({ error: error instanceof Error ? error.message : 'Internal server error' })
  }
}
