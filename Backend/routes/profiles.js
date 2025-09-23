const express = require('express')
const router = express.Router()
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null

// In-memory storage for development when Supabase is not configured
let profiles = []

// POST /api/profiles - Ensure profile exists (upsert behavior)
router.post('/', async (req, res) => {
  try {
    const body = req.body || {}
    const now = new Date().toISOString()
    
    if (supabase) {
      // First, check if profile already exists by user_id (primary approach)
      if (body.id) {
        console.log('Checking for existing profile with user_id:', body.id)
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from('profiles')
          .select('id,user_id,email,full_name,avatar_url,plan,created_at,updated_at')
          .eq('user_id', body.id)
          .limit(1)
          .maybeSingle()
        
        if (profileCheckError && profileCheckError.code !== 'PGRST116') {
          console.error('Profile check error:', profileCheckError)
          throw profileCheckError
        }
        
        if (existingProfile) {
          console.log('Found existing profile:', existingProfile.id)
          return res.status(200).json({ profile: existingProfile })
        }
      }

      // Secondary check: if email provided, check by email
      if (body.email) {
        console.log('Checking for existing profile with email:', body.email)
        const { data: existing, error: selErr } = await supabase
          .from('profiles')
          .select('id,user_id,email,full_name,avatar_url,plan,created_at,updated_at')
          .eq('email', body.email)
          .limit(1)
          .maybeSingle()
        
        if (selErr && selErr.code !== 'PGRST116') {
          console.error('Email check error:', selErr)
          throw selErr
        }
        
        if (existing) {
          console.log('Found existing profile by email:', existing.id)
          return res.status(200).json({ profile: existing })
        }
      }

      // No existing profile found, create new one
      // IMPORTANT: id and user_id must be the same (both = auth.users.id)
      const userId = body.id || body.user_id
      if (!userId) {
        throw new Error('Missing user ID for profile creation')
      }
      
      const insert = {
        id: userId,           // id = user_id = auth.users.id
        user_id: userId,      // user_id = auth.users.id  
        email: body.email || '',
        full_name: body.full_name || body.name || 'Guest',
        avatar_url: body.avatar_url || null,
        plan: body.plan || 'free',
      }
      
      console.log('Creating new profile:', insert)
      
      // Use upsert to handle race conditions
      // Since id = user_id, we can conflict on either, but id is the primary key
      const { data, error } = await supabase
        .from('profiles')
        .upsert(insert, { 
          onConflict: 'id',     // Primary key conflict
          ignoreDuplicates: false 
        })
        .select('id,user_id,email,full_name,avatar_url,plan,created_at,updated_at')
        .single()
      
      if (error) {
        console.error('Profile upsert error:', error)
        
        // If still getting duplicate error, try to fetch the existing profile
        if (error.code === '23505') {
          console.log('Duplicate detected, fetching existing profile...')
          const { data: existingAfterError } = await supabase
            .from('profiles')
            .select('id,user_id,email,full_name,avatar_url,plan,created_at,updated_at')
            .eq('id', insert.id)        // Use id since id = user_id
            .single()
          
          if (existingAfterError) {
            console.log('Returning existing profile after duplicate error:', existingAfterError.id)
            return res.status(200).json({ profile: existingAfterError })
          }
        }
        
        throw error
      }
      
      console.log('Profile created successfully:', data.id)
      res.status(201).json({ profile: data })
      
    } else {
      // Use in-memory storage when Supabase is not configured
      if (body.email) {
        const existing = profiles.find(p => p.email === body.email)
        if (existing) return res.status(200).json({ profile: existing })
      }

      // IMPORTANT: id and user_id must be the same (both = auth.users.id)
      const userId = body.id || body.user_id || require('crypto').randomUUID()
      
      const profile = {
        id: userId,           // id = user_id
        user_id: userId,      // user_id = auth.users.id
        email: body.email || '',
        full_name: body.full_name || body.name || 'Guest',
        avatar_url: body.avatar_url || null,
        plan: body.plan || 'free',
        created_at: now,
        updated_at: now,
      }
      profiles.push(profile)
      res.status(201).json({ profile })
    }
  } catch (err) {
    console.error('POST /api/profiles error:', err)
    res.status(500).json({ 
      error: 'Failed to create profile',
      message: err.message,
      code: err.code 
    })
  }
})

module.exports = router


