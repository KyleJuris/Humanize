import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { text, intensity, tone } = req.body

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' })
    }

    // For now, return a simple humanized version
    // In a real implementation, this would call an AI service
    const humanizedText = await humanizeText(text, intensity, tone)

    res.status(200).json({
      humanizedText,
      originalText: text,
      intensity,
      tone,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Humanize API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function humanizeText(text: string, intensity: number = 50, tone: string = 'neutral'): Promise<string> {
  // This is a placeholder implementation
  // In a real app, you would call an AI service like OpenAI, Anthropic, etc.
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simple text transformations based on intensity and tone
  let humanized = text
  
  // Apply tone-based transformations
  switch (tone) {
    case 'casual':
      humanized = humanized
        .replace(/\b(utilize|utilizing)\b/gi, 'use')
        .replace(/\b(commence|commencing)\b/gi, 'start')
        .replace(/\b(terminate|terminating)\b/gi, 'end')
        .replace(/\b(endeavor|endeavoring)\b/gi, 'try')
        .replace(/\b(ascertain|ascertaining)\b/gi, 'find out')
        .replace(/\b(approximately)\b/gi, 'about')
        .replace(/\b(subsequently)\b/gi, 'then')
        .replace(/\b(consequently)\b/gi, 'so')
        .replace(/\b(furthermore)\b/gi, 'also')
        .replace(/\b(nevertheless)\b/gi, 'but')
        .replace(/\b(consequently)\b/gi, 'so')
      break
      
    case 'academic':
      humanized = humanized
        .replace(/\b(use|using)\b/gi, 'utilize')
        .replace(/\b(start|starting)\b/gi, 'commence')
        .replace(/\b(end|ending)\b/gi, 'terminate')
        .replace(/\b(try|trying)\b/gi, 'endeavor')
        .replace(/\b(find out|finding out)\b/gi, 'ascertain')
        .replace(/\b(about)\b/gi, 'approximately')
        .replace(/\b(then)\b/gi, 'subsequently')
        .replace(/\b(so)\b/gi, 'consequently')
        .replace(/\b(also)\b/gi, 'furthermore')
        .replace(/\b(but)\b/gi, 'nevertheless')
      break
      
    case 'marketing':
      humanized = humanized
        .replace(/\b(good|great|excellent)\b/gi, 'amazing')
        .replace(/\b(help)\b/gi, 'empower')
        .replace(/\b(make)\b/gi, 'create')
        .replace(/\b(show)\b/gi, 'reveal')
        .replace(/\b(prove)\b/gi, 'demonstrate')
        .replace(/\b(change)\b/gi, 'transform')
        .replace(/\b(improve)\b/gi, 'enhance')
        .replace(/\b(fast)\b/gi, 'lightning-fast')
        .replace(/\b(easy)\b/gi, 'effortless')
        .replace(/\b(new)\b/gi, 'innovative')
      break
  }
  
  // Apply intensity-based transformations
  const intensityFactor = intensity / 100
  
  if (intensityFactor > 0.7) {
    // High intensity - more dramatic changes
    humanized = humanized
      .replace(/\b(very)\b/gi, 'extremely')
      .replace(/\b(really)\b/gi, 'absolutely')
      .replace(/\b(quite)\b/gi, 'remarkably')
      .replace(/\b(somewhat)\b/gi, 'significantly')
  } else if (intensityFactor < 0.3) {
    // Low intensity - subtle changes
    humanized = humanized
      .replace(/\b(extremely)\b/gi, 'quite')
      .replace(/\b(absolutely)\b/gi, 'really')
      .replace(/\b(remarkably)\b/gi, 'quite')
      .replace(/\b(significantly)\b/gi, 'somewhat')
  }
  
  // Add some natural variations
  if (Math.random() > 0.5) {
    humanized = humanized
      .replace(/\b(and)\b/gi, (match, offset) => {
        if (offset > 0 && Math.random() > 0.7) {
          return Math.random() > 0.5 ? 'as well as' : 'plus'
        }
        return match
      })
  }
  
  // Ensure the text doesn't look too artificial
  if (humanized === text && intensity > 20) {
    // If no changes were made, add a subtle variation
    humanized = text + ' (Enhanced for better readability)'
  }
  
  return humanized
}
