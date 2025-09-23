// API service layer
export interface HumanizeResponse {
  outputText: string
  versionId: string
}

export interface CheckResponse {
  scores: {
    detectorA: number
    detectorB: number
    overall: number
  }
  notes: string
}

export interface Project {
  id: string
  user_id?: string
  title: string
  input_text: string
  output_text: string
  language: string
  tone: string
  intensity: number
  flags: { avoidBurstiness: boolean; avoidPerplexity: boolean }
  archived: boolean
  created_at: string
  updated_at: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }))
    console.error('API Error:', error);
    throw new Error(error.message || error.error || 'API call failed')
  }

  return response.json()
}

export const api = {
  async humanize(
    inputText: string,
    options: {
      tone: string
      intensity: number
      language: string
      flags: { avoidBurstiness: boolean; avoidPerplexity: boolean }
    },
  ): Promise<HumanizeResponse> {
    const response = await apiCall('/humanize', {
      method: 'POST',
      body: JSON.stringify({
        text: inputText,
        tone: options.tone,
        intensity: options.intensity,
        language: options.language,
        flags: options.flags,
      }),
    })

    return {
      outputText: response.outputText,
      versionId: response.versionId,
    }
  },

  async checkAI(text: string): Promise<CheckResponse> {
    const response = await apiCall('/humanize/check', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })

    return {
      scores: response.scores,
      notes: response.notes,
    }
  },

  async getProjects(userId: string): Promise<Project[]> {
    const response = await apiCall(`/projects?userId=${userId}`)
    return response.projects || []
  },

  async createProject(project: {
    userId: string
    title: string
    inputText: string
    outputText: string
    language: string
    tone: string
    intensity: number
    flags: { avoidBurstiness: boolean; avoidPerplexity: boolean }
    archived: boolean
  }): Promise<Project> {
    const response = await apiCall('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    })
    return response.project
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const response = await apiCall(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    return response.project
  },

  async deleteProject(id: string): Promise<void> {
    await apiCall(`/projects/${id}`, {
      method: 'DELETE',
    })
  },

  async sendOtp(email: string) {
    const response = await apiCall('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    return response
  },

  async completeSignup(email: string, userId: string, firstName: string, lastName: string) {
    const response = await apiCall('/auth/complete-signup', {
      method: 'POST',
      body: JSON.stringify({ email, userId, firstName, lastName }),
    })
    return response
  },

  async logout() {
    try {
      // Import supabase client for logout
      const { supabase } = await import('@/lib/supabase')
      
      if (supabase) {
        // Sign out from Supabase
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error('Supabase logout error:', error)
          throw error
        }
        console.log('Successfully signed out from Supabase')
      }
      
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  },

  async ensureProfile(profile: any) {
    const response = await apiCall('/profiles', {
      method: 'POST',
      body: JSON.stringify(profile),
    })
    return response.profile
  },

  async getProfile() {
    try {
      const { supabase } = await import('@/lib/supabase')
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const response = await apiCall(`/profiles/${user.id}`)
          return response.profile
        }
      }
      return null
    } catch (error) {
      console.error('Get profile error:', error)
      return null
    }
  },

  async getPlans() {
    return [
      {
        id: "basic",
        name: "Basic",
        price: { monthly: 9, annual: 90 },
        words: 50000,
        features: ["50,000 words/month", "Basic humanization", "Email support"],
      },
      {
        id: "pro",
        name: "Pro",
        price: { monthly: 19, annual: 190 },
        words: 150000,
        features: ["150,000 words/month", "Advanced humanization", "Priority support", "API access"],
      },
      {
        id: "ultra",
        name: "Ultra",
        price: { monthly: 39, annual: 390 },
        words: 500000,
        features: ["500,000 words/month", "Premium humanization", "24/7 support", "API access", "Custom integrations"],
      },
    ]
  },
}