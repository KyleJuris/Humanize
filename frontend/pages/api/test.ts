import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test environment variables
    const envCheck = {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'Set' : 'Missing',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? 'Set' : 'Missing',
      NODE_ENV: process.env.NODE_ENV || 'not set'
    }

    console.log('Environment check:', envCheck)

    res.json({
      message: 'API route is working',
      environment: envCheck,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Test API error:', error)
    res.status(500).json({ 
      error: 'Test API failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
