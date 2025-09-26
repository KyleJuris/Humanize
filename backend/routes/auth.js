const express = require('express');
const { supabase, supabaseAnon } = require('../config/database');
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

    // Send magic link for signup using anon client
    const { data, error } = await supabaseAnon.auth.signInWithOtp({
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

    // Send magic link for signin using anon client
    const { data, error } = await supabaseAnon.auth.signInWithOtp({
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

    console.log('🔍 Validating token with Supabase...');
    
    // Use the anon client to validate the token (since it was issued by the anon client)
    const { data: { user }, error } = await supabaseAnon.auth.getUser(token);

    if (error) {
      console.error('❌ Token validation failed:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.log('✅ Token validated for user:', user.email);

    // Get user profile using the service role client (for admin access)
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
    const { error } = await supabaseAnon.auth.signOut();
    
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
