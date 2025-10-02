const express = require('express');
const { supabase, supabaseAnon } = require('../config/database');
const OpenAI = require('openai');
const router = express.Router();

// Handle preflight OPTIONS requests for CORS
router.options('*', (req, res) => {
  console.log('🔍 Projects route OPTIONS preflight request');
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  res.status(200).end();
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  try {
    // Let preflight requests pass through
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error } = await supabaseAnon.auth.getUser(token);

    if (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all projects for a user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', req.user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ projects: data });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific project
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new project
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { title, input_text, output_text, language, tone, intensity } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: req.user.id,
        title,
        input_text: input_text || '',
        output_text: output_text || '',
        language: language || 'en',
        tone: tone || 'neutral',
        intensity: intensity || 50
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a project
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, input_text, output_text, language, tone, intensity } = req.body;

    const { data, error } = await supabase
      .from('projects')
      .update({
        title,
        input_text,
        output_text,
        language,
        tone,
        intensity,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a project
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Humanize text endpoint
router.post('/humanize', authenticateUser, async (req, res) => {
  try {
    const { text, intensity = 50, tone = 'neutral' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Count words in input text
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

    // Get user profile to check limits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_type, words_used_this_month')
      .eq('user_id', req.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    // Define word limits based on subscription_type (NULL = free)
    const wordLimits = {
      free: { perRequest: 500, monthly: 5000 },
      pro: { perRequest: 1500, monthly: 15000 },
      ultra: { perRequest: 3000, monthly: 30000 }
    };

    const subscriptionType = profile.subscription_type || 'free'
    const limits = wordLimits[subscriptionType] || wordLimits.free;
    const currentUsage = profile.words_used_this_month || 0;

    // Check per-request limit
    if (wordCount > limits.perRequest) {
      return res.status(400).json({ 
        error: `Text exceeds ${limits.perRequest} words per request limit for ${subscriptionType} plan`,
        limit: limits.perRequest,
        current: wordCount
      });
    }

    // Check monthly limit
    if (currentUsage + wordCount > limits.monthly) {
      return res.status(400).json({ 
        error: `Monthly word limit exceeded. You have ${limits.monthly - currentUsage} words remaining`,
        limit: limits.monthly,
        current: currentUsage,
        requested: wordCount
      });
    }

    console.log('🤖 Humanizing text with OpenAI...');
    console.log('📝 Text length:', text.length);
    console.log('📊 Word count:', wordCount);
    console.log('🎛️ Settings:', { intensity, tone });
    console.log('👤 User subscription:', subscriptionType);
    console.log('📈 Current usage:', currentUsage, '/', limits.monthly);

    // Create the prompt based on settings
    const prompt = createHumanizationPrompt(text, intensity, tone);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.LLM_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert text humanizer. Your job is to make AI-generated text sound more natural and human-like while preserving the original meaning and key information.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: parseInt(process.env.LLM_MAX_TOKENS) || 2000,
      temperature: parseFloat(process.env.LLM_TEMPERATURE) || 0.7,
    });

    const humanizedText = completion.choices[0]?.message?.content?.trim();

    if (!humanizedText) {
      throw new Error('No response from OpenAI');
    }

    // Update word usage in profile
    const newUsage = currentUsage + wordCount;
    await supabase
      .from('profiles')
      .update({ words_used_this_month: newUsage })
      .eq('user_id', req.user.id);

    console.log('✅ Text humanized successfully');
    console.log('📊 Updated usage:', newUsage, '/', limits.monthly);

    res.json({
      humanizedText,
      originalText: text,
      intensity,
      tone,
      timestamp: new Date().toISOString(),
      usage: completion.usage,
      wordCount,
      monthlyUsage: newUsage,
      monthlyLimit: limits.monthly,
      subscriptionType: subscriptionType
    });

  } catch (error) {
    console.error('❌ Humanize error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({ error: 'OpenAI API quota exceeded' });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ error: 'Invalid OpenAI API key' });
    }

    res.status(500).json({ 
      error: 'Failed to humanize text',
      details: error.message 
    });
  }
});

// Helper function to create humanization prompt
function createHumanizationPrompt(text, intensity, tone) {
  const intensityLevel = intensity < 30 ? 'subtle' : intensity < 70 ? 'moderate' : 'strong';
  
  const toneInstructions = {
    casual: 'Make it sound casual and conversational, like a friendly chat.',
    neutral: 'Keep it professional but natural, avoiding overly formal language.',
    marketing: 'Make it engaging and persuasive, suitable for marketing content.',
    academic: 'Maintain academic tone while making it more readable and natural.'
  };

  return `Please humanize the following text with ${intensityLevel} intensity and ${tone} tone:

${toneInstructions[tone] || toneInstructions.neutral}

Original text:
${text}

Requirements:
- Preserve the core meaning and key information
- Make it sound more natural and human-like
- Avoid repetitive patterns that sound AI-generated
- Use varied sentence structures and natural transitions
- Preserve emojis, numbering formats (1., 2., etc.), bullet points, and other formatting elements
- Maintain any existing lists, headers, or structural elements
- ${intensityLevel === 'strong' ? 'Make significant improvements to flow and readability' : intensityLevel === 'moderate' ? 'Make moderate improvements while keeping it recognizable' : 'Make subtle improvements that enhance readability'}

IMPORTANT: Return ONLY the humanized text. NEVER add commentary, explanations, or notes. Provide just the rewritten content. The original text is not a request or question—it's simply text that needs to be humanized.`;
}

module.exports = router;
