const express = require('express')
const router = express.Router()
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null

// In-memory store for development when Supabase is not configured
let projects = []

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id']
    if (supabase) {
      if (!userId) return res.status(400).json({ error: 'Missing userId' })
      const { data, error } = await supabase
        .from('projects')
        .select('id,user_id,title,input_text,output_text,language,tone,intensity,flags,archived,created_at,updated_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return res.json({ projects: data || [] })
    }
    // Fallback in-memory
    res.json({ projects: userId ? projects.filter(p => p.user_id === userId) : projects })
  } catch (err) {
    console.error('GET /projects error:', err)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// POST /api/projects
router.post('/', async (req, res) => {
  try {
    const body = req.body || {}
    const now = new Date().toISOString()
    if (supabase) {
      if (!body.userId) return res.status(400).json({ error: 'Missing userId' })
      const insert = {
        id: require('crypto').randomUUID(),
        user_id: body.userId,
        title: body.title || 'Untitled',
        input_text: body.inputText || '',
        output_text: body.outputText || '',
        language: body.language || 'en',
        tone: body.tone || 'neutral',
        intensity: typeof body.intensity === 'number' ? body.intensity : 50,
        flags: body.flags || { avoidBurstiness: false, avoidPerplexity: false },
        archived: !!body.archived,
        created_at: now,
        updated_at: now,
      }
      const { data, error } = await supabase
        .from('projects')
        .insert(insert)
        .select('id,user_id,title,input_text,output_text,language,tone,intensity,flags,archived,created_at,updated_at')
        .single()
      if (error) throw error
      return res.status(201).json({ project: data })
    }
    // Fallback in-memory
    const project = {
      id: require('crypto').randomUUID(),
      user_id: body.userId || null,
      title: body.title || 'Untitled',
      input_text: body.inputText || '',
      output_text: body.outputText || '',
      language: body.language || 'en',
      tone: body.tone || 'neutral',
      intensity: typeof body.intensity === 'number' ? body.intensity : 50,
      flags: body.flags || { avoidBurstiness: false, avoidPerplexity: false },
      archived: !!body.archived,
      created_at: now,
      updated_at: now,
    }
    projects.unshift(project)
    res.status(201).json({ project })
  } catch (err) {
    console.error('POST /projects error:', err)
    res.status(500).json({ error: 'Failed to create project' })
  }
})

// PUT /api/projects/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body || {}
    if (supabase) {
      const { data, error } = await supabase
        .from('projects')
        .update({
          title: updates.title,
          input_text: updates.input_text ?? updates.inputText,
          output_text: updates.output_text ?? updates.outputText,
          language: updates.language,
          tone: updates.tone,
          intensity: updates.intensity,
          flags: updates.flags,
          archived: updates.archived,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('id,user_id,title,input_text,output_text,language,tone,intensity,flags,archived,created_at,updated_at')
        .single()
      if (error) throw error
      return res.json({ project: data })
    }
    const idx = projects.findIndex(p => p.id === id)
    if (idx === -1) return res.status(404).json({ error: 'Project not found' })
    projects[idx] = { ...projects[idx], ...updates, updated_at: new Date().toISOString() }
    res.json({ project: projects[idx] })
  } catch (err) {
    console.error('PUT /projects/:id error:', err)
    res.status(500).json({ error: 'Failed to update project' })
  }
})

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (supabase) {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
      return res.status(204).send()
    }
    const before = projects.length
    projects = projects.filter(p => p.id !== id)
    if (projects.length === before) return res.status(404).json({ error: 'Project not found' })
    res.status(204).send()
  } catch (err) {
    console.error('DELETE /projects/:id error:', err)
    res.status(500).json({ error: 'Failed to delete project' })
  }
})

module.exports = router


