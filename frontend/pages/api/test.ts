import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Test API route called:', {
    method: req.method,
    url: req.url,
    headers: req.headers
  })

  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Test API route working',
      method: req.method,
      timestamp: new Date().toISOString()
    })
  }

  if (req.method === 'POST') {
    return res.status(200).json({ 
      message: 'Test API route working with POST',
      method: req.method,
      body: req.body,
      timestamp: new Date().toISOString()
    })
  }

  return res.status(405).json({ 
    error: 'Method not allowed',
    receivedMethod: req.method,
    allowedMethods: ['GET', 'POST']
  })
}