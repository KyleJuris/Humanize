const express = require('express');
const supabase = require('../config/database');
const router = express.Router();

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

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

// Get user profile
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/', authenticateUser, async (req, res) => {
  try {
    const { user_name, avatar_url, plan, words_used_this_month } = req.body;

    const updateData = {
      user_name,
      avatar_url,
      plan,
      updated_at: new Date().toISOString()
    };

    // Only update words_used_this_month if provided
    if (words_used_this_month !== undefined) {
      updateData.words_used_this_month = words_used_this_month;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create user profile (called after successful auth)
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { user_name, avatar_url, plan } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: req.user.id,
        email: req.user.email,
        user_name: user_name || '',
        avatar_url: avatar_url || null,
        plan: plan || 'free',
        words_used_this_month: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
