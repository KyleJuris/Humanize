const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null

// In-memory storage for development when Supabase is not configured
let users = []
let nextUserId = 1
let otpStorage = new Map() // Store OTPs temporarily

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // TODO: Implement user registration logic
    // - Validate input
    // - Check if user exists
    // - Hash password
    // - Create user in database
    // - Generate JWT token
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: 'temp-id',
        email,
        name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, password, and name are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password too short',
        message: 'Password must be at least 6 characters long'
      });
    }

    if (supabase) {
      // First, create user in auth.users table
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          full_name: name
        },
        email_confirm: true // Auto-confirm email for development
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        return res.status(400).json({
          error: 'Signup failed',
          message: authError.message
        });
      }

      // Wait a moment for the user to be fully created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create profile entry using the auth user's ID
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          user_id: authData.user.id,
          email: authData.user.email,
          full_name: name,
          plan: 'free'
        })
        .select('id,email,full_name,avatar_url,plan,created_at,updated_at')
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        
        // Check if it's a duplicate key error
        if (profileError.code === '23505') {
          // Profile already exists, just return the existing profile
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('id,email,full_name,avatar_url,plan,created_at,updated_at')
            .eq('id', authData.user.id)
            .single();
          
          if (fetchError) {
            console.error('Failed to fetch existing profile:', fetchError);
            // Clean up auth user if we can't fetch the profile
            try {
              await supabase.auth.admin.deleteUser(authData.user.id);
            } catch (deleteError) {
              console.error('Failed to clean up auth user:', deleteError);
            }
            return res.status(500).json({
              error: 'Profile creation failed',
              message: 'Failed to create or fetch user profile'
            });
          }
          
          return res.status(201).json({
            message: 'User signed up successfully',
            user: {
              id: authData.user.id,
              email: authData.user.email,
              name: existingProfile.full_name,
              plan: existingProfile.plan
            }
          });
        }
        
        // For other errors, clean up the auth user
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
        } catch (deleteError) {
          console.error('Failed to clean up auth user:', deleteError);
        }
        return res.status(500).json({
          error: 'Profile creation failed',
          message: profileError.message || 'Failed to create user profile'
        });
      }

      res.status(201).json({
        message: 'User signed up successfully',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: profileData.full_name,
          plan: profileData.plan
        }
      });
    } else {
      // Fallback to in-memory storage when Supabase is not configured
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({
          error: 'User already exists',
          message: 'An account with this email already exists'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = nextUserId.toString();
      nextUserId++;

      const user = {
        id: userId,
        email,
        password: hashedPassword,
        name,
        plan: 'free',
        created_at: new Date().toISOString()
      };

      users.push(user);

      res.status(201).json({
        message: 'User signed up successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan
        }
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Signup failed',
      message: error.message
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    if (supabase) {
      // Use Supabase Auth to authenticate user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        return res.status(401).json({
          error: 'Login failed',
          message: 'Invalid email or password'
        });
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id,email,full_name,avatar_url,plan,created_at,updated_at')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return res.status(500).json({
          error: 'Profile fetch failed',
          message: 'Failed to fetch user profile'
        });
      }

      res.json({
        message: 'Login successful',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: profileData.full_name,
          plan: profileData.plan
        },
        token: authData.session.access_token
      });
    } else {
      // Fallback to in-memory storage when Supabase is not configured
      const user = users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({
          error: 'Login failed',
          message: 'Invalid email or password'
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Login failed',
          message: 'Invalid email or password'
        });
      }

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan
        },
        token: 'temp-jwt-token'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  // TODO: Implement logout logic
  // - Invalidate JWT token
  
  res.json({
    message: 'Logout successful'
  });
});

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        error: 'Email required',
        message: 'Email address is required'
      });
    }

    let isNewUser = false;
    if (supabase) {
      // Determine if profile exists to hint at new/existing
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      isNewUser = !existingProfile;

      // Ask Supabase to send magic link email
      console.log(`Sending magic link to ${email}`)
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: process.env.FRONTEND_URL
            ? `${process.env.FRONTEND_URL}/auth`
            : 'http://localhost:3000/auth',
        },
      });
      if (otpError) {
        console.error('Supabase send magic link error:', otpError);
        return res.status(500).json({ error: 'Failed to send magic link', message: otpError.message });
      }
      console.log(`Magic link sent successfully to ${email}`)

      return res.json({ message: 'OTP sent successfully', isNewUser });
    }

    // Fallback (no Supabase): generate and log OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    isNewUser = !users.find(u => u.email === email);
    otpStorage.set(email, { otp, expiresAt, isNewUser });
    console.log(`OTP for ${email}: ${otp} (expires at ${expiresAt})`);
    res.json({ message: 'OTP sent successfully', isNewUser });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      error: 'Failed to send OTP',
      message: error.message
    });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and OTP are required'
      });
    }

    if (supabase) {
      // Try verify as existing user, then as signup if needed
      let verifyData = null;
      let verifyError = null;
      let typeTried = 'email';
      let result = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
      verifyData = result.data; verifyError = result.error;
      if (verifyError) {
        typeTried = 'signup';
        result = await supabase.auth.verifyOtp({ email, token: otp, type: 'signup' });
        verifyData = result.data; verifyError = result.error;
      }
      if (verifyError) {
        console.error('Supabase verify OTP error:', verifyError);
        return res.status(400).json({ error: 'OTP verification failed', message: verifyError.message });
      }

      const user = verifyData.user;
      if (!user) {
        return res.status(500).json({ error: 'User missing after verification' });
      }

      // Check if profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id,email,full_name,avatar_url,plan,created_at,updated_at')
        .eq('id', user.id)
        .maybeSingle();
      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return res.status(500).json({ error: 'Profile fetch failed', message: profileError.message });
      }

      if (!profileData) {
        // New user: prompt for profile completion
        return res.json({ message: 'OTP verified successfully', isNewUser: true, user: { id: user.id, email: user.email } });
      }

      // Existing user: return profile
      return res.json({
        message: 'Login successful',
        user: {
          id: profileData.id,
          email: profileData.email,
          name: profileData.full_name,
          plan: profileData.plan,
        },
      });
    }

    // Fallback without Supabase (dev only)
    const storedOtp = otpStorage.get(email);
    if (!storedOtp) {
      return res.status(400).json({ error: 'Invalid OTP', message: 'No OTP found for this email' });
    }
    if (new Date() > storedOtp.expiresAt) {
      otpStorage.delete(email);
      return res.status(400).json({ error: 'OTP expired', message: 'OTP has expired. Please request a new one.' });
    }
    if (storedOtp.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP', message: 'Invalid OTP. Please check and try again.' });
    }
    if (storedOtp.isNewUser) {
      return res.json({ message: 'OTP verified successfully', isNewUser: true });
    }
    const user = users.find(u => u.email === email);
    otpStorage.delete(email);
    return res.json({ message: 'Login successful', user: { id: user.id, email: user.email, name: user.name, plan: user.plan } });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      error: 'OTP verification failed',
      message: error.message
    });
  }
});

// POST /api/auth/complete-signup
router.post('/complete-signup', async (req, res) => {
  try {
    const { email, userId, firstName, lastName } = req.body;
    
    if (!email || !firstName || !lastName) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, first name, and last name are required'
      });
    }

    const fullName = `${firstName} ${lastName}`;

    if (supabase) {
      // Ensure we have the user id
      let uid = userId;
      if (!uid) {
        // Attempt to find by email via profiles first
        const { data: maybeProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .maybeSingle();
        if (maybeProfile?.id) uid = maybeProfile.id;
      }
      if (!uid) {
        return res.status(400).json({ error: 'Missing userId', message: 'UserId required after OTP verification' });
      }

      // Update auth user metadata with full name
      const { error: updateErr } = await supabase.auth.admin.updateUserById(uid, { user_metadata: { full_name: fullName } });
      if (updateErr) {
        console.error('Update user metadata error:', updateErr);
        // Not fatal; continue
      }

      // Create profile if not exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', uid)
        .maybeSingle();

      let profileData = existingProfile;
      if (!existingProfile) {
        const insert = await supabase
          .from('profiles')
          .insert({ id: uid, user_id: uid, email, full_name: fullName, plan: 'free' })
          .select('id,email,full_name,avatar_url,plan,created_at,updated_at')
          .single();
        if (insert.error) {
          console.error('Profile creation error:', insert.error);
          return res.status(500).json({ error: 'Profile creation failed', message: insert.error.message });
        }
        profileData = insert.data;
      } else {
        const sel = await supabase
          .from('profiles')
          .select('id,email,full_name,avatar_url,plan,created_at,updated_at')
          .eq('id', uid)
          .single();
        if (sel.error) {
          console.error('Profile fetch error:', sel.error);
          return res.status(500).json({ error: 'Profile fetch failed', message: sel.error.message });
        }
        profileData = sel.data;
      }

      return res.status(201).json({
        message: 'Account created successfully',
        user: {
          id: profileData.id,
          email: profileData.email,
          name: profileData.full_name,
          plan: profileData.plan,
        },
      });
    } else {
      // Fallback to in-memory storage
      const userId = nextUserId.toString();
      nextUserId++;

      const user = {
        id: userId,
        email,
        name: fullName,
        plan: 'free',
        created_at: new Date().toISOString()
      };

      users.push(user);
      otpStorage.delete(email);

      res.status(201).json({
        message: 'Account created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan
        }
      });
    }
  } catch (error) {
    console.error('Complete signup error:', error);
    res.status(500).json({
      error: 'Signup completion failed',
      message: error.message
    });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // TODO: Implement forgot password logic
    // - Check if user exists
    // - Generate reset token
    // - Send reset email
    
    res.json({
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Failed to send reset email',
      message: error.message
    });
  }
});

module.exports = router;




