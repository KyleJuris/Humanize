const express = require('express');
const supabase = require('../config/database');
const router = express.Router();

// Sign up with email
router.post('/signup', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables not configured');
      return res.status(500).json({ 
        error: 'Server configuration error. Please contact support.',
        debug: 'Missing Supabase environment variables'
      });
    }

    // Send magic link for signup
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL || 'https://humanize-pro.vercel.app'}/auth/callback`
      }
    });

    if (error) {
      console.error('Supabase auth error:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('Magic link sent successfully to:', email);
    res.json({ 
      message: 'Magic link sent to your email',
      data 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign in with email
router.post('/signin', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables not configured');
      return res.status(500).json({ 
        error: 'Server configuration error. Please contact support.',
        debug: 'Missing Supabase environment variables'
      });
    }

    // Send magic link for signin
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL || 'https://humanize-pro.vercel.app'}/auth/callback`
      }
    });

    if (error) {
      console.error('Supabase auth error:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('Magic link sent successfully to:', email);
    res.json({ 
      message: 'Magic link sent to your email',
      data 
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError);
    }

    res.json({ 
      user: {
        id: user.id,
        email: user.email,
        ...profile
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign out
router.post('/signout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Signout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
