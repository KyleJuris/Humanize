import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { buffer } from 'micro'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// Placeholder function to update user subscription status in database
async function updateUserSubscriptionStatus(customerIdentifier: string, status: string) {
  try {
    console.log(`Updating subscription status for ${customerIdentifier} to ${status}`)
    // TODO: Implement database update logic
    // This would typically update a user's subscription status in your database
    // based on the customer email or customer ID from Stripe
  } catch (error) {
    console.error('Error updating subscription status:', error)
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  let event: Stripe.Event

  try {
    // Get the raw body for webhook signature verification
    const buf = await buffer(req)
    event = stripe.webhooks.constructEvent(buf, sig!, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
  }

  console.log(`Received webhook event: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        console.log(`Checkout session completed: ${session.id}`)
        // TODO: Update user subscription status in database
        await updateUserSubscriptionStatus(session.customer_email || '', 'active')
        break

      case 'customer.subscription.updated':
        const subscription = event.data.object
        console.log(`Customer subscription updated: ${subscription.id}`)
        // TODO: Update user subscription status in database
        await updateUserSubscriptionStatus(subscription.customer as string, subscription.status)
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        console.log(`Customer subscription deleted: ${deletedSubscription.id}`)
        // TODO: Update user subscription status in database
        await updateUserSubscriptionStatus(deletedSubscription.customer as string, 'cancelled')
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
}

// Configure the API route to handle raw body
export const config = {
  api: {
    bodyParser: false,
  },
}
