import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { session_id } = req.query
    
    if (!session_id || typeof session_id !== 'string') {
      return res.status(400).json({ error: 'Session ID is required' })
    }

    const session = await stripe.checkout.sessions.retrieve(session_id)

    res.json({
      status: session.status,
      customer_email: session.customer_details?.email
    })

  } catch (error) {
    console.error('Error retrieving session status:', error)
    res.status(400).json({ error: error instanceof Error ? error.message : 'Internal server error' })
  }
}
