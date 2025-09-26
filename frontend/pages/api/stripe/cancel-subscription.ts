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
    const userId = user.id
    const userEmail = user.email

    // Find customer by email
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    })

    if (customers.data.length === 0) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    const customer = customers.data[0]

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1
    })

    if (subscriptions.data.length === 0) {
      return res.status(404).json({ error: 'No active subscription found' })
    }

    const subscription = subscriptions.data[0]

    // Cancel subscription
    const canceledSubscription = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true
    })

    res.json({
      message: 'Subscription will be canceled at the end of the current period',
      subscription: {
        id: canceledSubscription.id,
        status: canceledSubscription.status,
        cancelAtPeriodEnd: canceledSubscription.cancel_at_period_end,
        currentPeriodEnd: canceledSubscription.current_period_end
      }
    })

  } catch (error) {
    console.error('Error canceling subscription:', error)
    res.status(400).json({ error: error instanceof Error ? error.message : 'Internal server error' })
  }
}
