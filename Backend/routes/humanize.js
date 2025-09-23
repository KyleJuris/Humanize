const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Helper function to build humanization prompt based on settings
function buildHumanizationPrompt(text, options) {
  const { tone, intensity, language, flags } = options;
  
  let prompt = `Please humanize the following text to make it appear naturally written by a human rather than AI-generated. `;
  
  // Add tone instructions
  switch(tone) {
    case 'academic':
      prompt += `Maintain an academic and scholarly tone while making it sound more natural. `;
      break;
    case 'casual':
      prompt += `Make the text more casual and conversational, as if spoken by a friend. `;
      break;
    case 'marketing':
      prompt += `Keep the persuasive marketing tone but make it sound more authentic and engaging. `;
      break;
    case 'neutral':
    default:
      prompt += `Maintain the original tone and style of the input text while making it sound more natural and human. `;
      break;
  }
  
  // Add intensity instructions
  if (intensity <= 30) {
    prompt += `Make subtle changes to preserve the original style while adding human touches. `;
  } else if (intensity <= 70) {
    prompt += `Make moderate changes to significantly improve the natural flow and readability. `;
  } else {
    prompt += `Substantially rewrite the text to sound completely human-written while preserving all key information. `;
  }
  
  // Add language instructions
  if (language !== 'en') {
    prompt += `Respond in ${language} language. `;
  }
  
  // Note: Burstiness and perplexity avoidance are now included as baseline rules
  
  prompt += `\n\nIMPORTANT RULES:
- Preserve all factual information and key points
- Maintain the original length approximately
- Do not add disclaimers or meta-commentary
- Return only the humanized text, nothing else
- Make it sound like it was written by a knowledgeable human
- Do not wrap the response in quotes or any other markup
- Avoid sudden changes in writing style or tone (maintain consistent burstiness)
- Use natural, varied language choices (reduce predictable AI patterns)
- Avoid repetitive sentence structures and vary your sentence construction

Text to humanize:
"${text}"`;

  return prompt;
}

// POST /api/humanize/text
router.post('/text', async (req, res) => {
  try {
    const { text, options = {} } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Text is required and must be a string'
      });
    }
    
    // TODO: Implement text humanization logic
    // - Call OpenAI API to humanize text
    // - Apply humanization techniques
    // - Return humanized text
    
    const humanizedText = `Humanized: ${text}`; // Placeholder
    
    res.json({
      originalText: text,
      humanizedText,
      options,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Humanization error:', error);
    res.status(500).json({
      error: 'Humanization failed',
      message: error.message
    });
  }
});

// POST /api/humanize - Main humanize endpoint that frontend calls
router.post('/', async (req, res) => {
  console.log('=== HUMANIZE REQUEST RECEIVED ===');
  console.log('Request body:', req.body);
  
  try {
    const { text, tone = 'neutral', intensity = 50, language = 'en', flags = {} } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Text is required and must be a string'
      });
    }

    if (!openai) {
      console.warn('OpenAI API key not configured, using fallback humanization');
      // Fallback to simple text transformation if OpenAI is not available
      const outputText = text
        .replace(/\b(very|really|quite)\b/g, "")
        .replace(/\b(I think|I believe|In my opinion)\b/g, "")
        .replace(/\b(Furthermore|Moreover|Additionally)\b/g, "Also")
        .replace(/\b(utilize|implement|facilitate)\b/g, "use");
      
      return res.json({
        outputText: outputText.trim() || text,
        versionId: require('crypto').randomUUID(),
        timestamp: new Date().toISOString()
      });
    }

    console.log('Humanizing text with OpenAI...', { 
      textLength: text.length, 
      tone, 
      intensity, 
      language, 
      flags,
      hasOpenAI: !!openai 
    });

    // Build humanization prompt based on settings
    const humanizationPrompt = buildHumanizationPrompt(text, {
      tone,
      intensity,
      language,
      flags
    });

    // Call OpenAI API
    console.log('Sending to OpenAI:', {
      model: "gpt-4o-mini",
      temperature: intensity / 100,
      max_tokens: Math.min(4000, text.length * 2),
      prompt_preview: humanizationPrompt.substring(0, 200) + '...'
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the more cost-effective model
      messages: [
        {
          role: "system",
          content: "You are an expert writing assistant specialized in humanizing AI-generated text. Your goal is to make text appear naturally written by humans while preserving the original meaning and key information. Focus on varying sentence structure, adding natural transitions, and making the writing flow more conversationally. IMPORTANT: Never add quotation marks or any markup that wasn't in the original text. Return only the humanized content without any additional formatting."
        },
        {
          role: "user",
          content: humanizationPrompt
        }
      ],
      max_tokens: Math.min(4000, text.length * 2), // Reasonable token limit
      temperature: intensity / 100, // Convert intensity (0-100) to temperature (0-1)
    });

    const outputText = completion.choices[0]?.message?.content?.trim() || text;
    const versionId = require('crypto').randomUUID();
    
    console.log('OpenAI humanization completed', {
      originalLength: text.length,
      outputLength: outputText.length,
      tokensUsed: completion.usage?.total_tokens || 0
    });
    
    res.json({
      outputText,
      versionId,
      timestamp: new Date().toISOString(),
      metadata: {
        model: completion.model,
        tokensUsed: completion.usage?.total_tokens || 0,
        settings: { tone, intensity, language, flags }
      }
    });
  } catch (error) {
    console.error('Humanization error:', error);
    
    // Provide helpful error messages
    let errorMessage = 'Humanization failed';
    if (error.code === 'insufficient_quota') {
      errorMessage = 'OpenAI API quota exceeded. Please check your billing.';
    } else if (error.code === 'invalid_api_key') {
      errorMessage = 'Invalid OpenAI API key configuration.';
    } else if (error.message?.includes('rate limit')) {
      errorMessage = 'Rate limit exceeded. Please try again in a moment.';
    }
    
    res.status(500).json({
      error: 'Humanization failed',
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/humanize/batch
router.post('/batch', async (req, res) => {
  try {
    const { texts, options = {} } = req.body;
    
    if (!Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Texts must be a non-empty array'
      });
    }
    
    // TODO: Implement batch humanization logic
    // - Process multiple texts
    // - Return array of humanized texts
    
    const humanizedTexts = texts.map(text => `Humanized: ${text}`);
    
    res.json({
      originalTexts: texts,
      humanizedTexts,
      options,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Batch humanization error:', error);
    res.status(500).json({
      error: 'Batch humanization failed',
      message: error.message
    });
  }
});

// POST /api/humanize/check - AI detection endpoint
router.post('/check', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Text is required and must be a string'
      });
    }
    
    // Mock AI detection scores
    const detectorA = Math.random() * 100;
    const detectorB = Math.random() * 100;
    const overall = (detectorA + detectorB) / 2;
    
    res.json({
      scores: {
        detectorA: Math.round(detectorA),
        detectorB: Math.round(detectorB),
        overall: Math.round(overall),
      },
      notes: overall > 70 ? "High AI probability detected" : overall > 40 ? "Moderate AI probability" : "Low AI probability",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI check error:', error);
    res.status(500).json({
      error: 'AI check failed',
      message: error.message
    });
  }
});

// GET /api/humanize/history
router.get('/history', async (req, res) => {
  try {
    // TODO: Implement history retrieval
    // - Get user's humanization history
    // - Apply pagination
    
    res.json({
      history: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      }
    });
  } catch (error) {
    console.error('History retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve history',
      message: error.message
    });
  }
});

module.exports = router;
