const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://humanize-fvj3.onrender.com/api' 
    : 'http://localhost:5000/api');

// For Stripe operations, use Next.js API routes
const STRIPE_API_BASE_URL = '/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = this.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('🚀 API Request:', { 
      url, 
      method: config.method || 'GET', 
      body: config.body 
    });

    try {
      const response = await fetch(url, config);
      console.log('📡 API Response:', { 
        url,
        status: response.status, 
        statusText: response.statusText,
        ok: response.ok
      });
      
      const data = await response.json();
      console.log('📄 API Data:', data);

      if (!response.ok) {
        console.error('❌ API Request Failed:', {
          url,
          status: response.status,
          statusText: response.statusText,
          error: data.error || `Request failed with status ${response.status}`
        });
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('💥 API request failed:', {
        url,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth methods
  async signUp(email) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async signIn(email) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async signOut() {
    const result = await this.request('/auth/signout', {
      method: 'POST',
    });
    this.removeToken();
    return result;
  }

  // Project methods
  async getProjects() {
    return this.request('/projects');
  }

  async getProject(id) {
    return this.request(`/projects/${id}`);
  }

  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id, projectData) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async humanizeText(text, options = {}) {
    return this.request('/projects/humanize', {
      method: 'POST',
      body: JSON.stringify({ text, ...options }),
    });
  }

  // Profile methods
  async getProfile() {
    return this.request('/profiles');
  }

  async updateProfile(profileData) {
    return this.request('/profiles', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async createProfile(profileData) {
    return this.request('/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  // Stripe subscription methods - all handled by backend for security
  async createCheckoutSession(priceId) {
    return this.request('/stripe/checkout-session', {
      method: 'POST',
      body: JSON.stringify({ priceId }),
    });
  }

  async createHostedCheckoutSession(priceId, customerEmail) {
    return this.request('/stripe-hosted/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ priceId, customerEmail }),
    });
  }

  async getSessionStatus(sessionId) {
    return this.request(`/stripe/session-status?session_id=${sessionId}`);
  }

  async getSubscriptionStatus() {
    return this.request('/stripe/subscription-status');
  }

  async cancelSubscription() {
    return this.request('/stripe/cancel-subscription', {
      method: 'POST',
    });
  }

  // Helper method for requests with different base URLs
  async requestWithBaseUrl(baseUrl, endpoint, options = {}) {
    const url = `${baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = this.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('🚀 Stripe API Request:', { 
      url, 
      method: config.method || 'GET', 
      body: config.body 
    });

    try {
      const response = await fetch(url, config);
      console.log('📡 Stripe API Response:', { 
        url,
        status: response.status, 
        statusText: response.statusText,
        ok: response.ok
      });
      
      // Handle non-OK responses gracefully
      if (!response.ok) {
        // Read response as text first to avoid JSON parsing errors
        const responseText = await response.text();
        console.error('❌ Stripe API Request Failed:', {
          url,
          status: response.status,
          statusText: response.statusText,
          responseText
        });
        
        // Try to parse as JSON, but don't fail if it's not valid JSON
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (jsonError) {
          errorData = { error: responseText || `Request failed with status ${response.status}` };
        }
        
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }
      
      // Parse JSON response for successful requests
      const data = await response.json();
      console.log('📄 Stripe API Data:', data);
      return data;
      
    } catch (error) {
      console.error('💥 Stripe API request failed:', {
        url,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
}

export default new ApiClient();
