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
      // Validate token before using it
      const validatedToken = this.validateAndExtractToken(token);
      if (validatedToken) {
        config.headers.Authorization = `Bearer ${validatedToken}`;
        console.log('🔐 Using validated token for request');
      } else {
        console.error('❌ Invalid token in localStorage, removing it');
        this.removeToken();
      }
    }

    console.log('🚀 API Request:', { 
      url, 
      method: config.method || 'GET',
      hasAuth: !!config.headers.Authorization
    });

    try {
      const response = await fetch(url, config);
      
      // Handle non-OK responses gracefully
      if (!response.ok) {
        // Read response as text first to avoid JSON parsing errors
        const responseText = await response.text();
        console.error('❌ API Request Failed:', {
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
        
        // Special handling for 401 errors
        if (response.status === 401) {
          console.log('🔐 401 Unauthorized - removing token');
          this.removeToken();
        }
        
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      // Parse JSON response for successful requests
      const data = await response.json();
      console.log('📄 API Response:', { url, status: response.status, data });
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
      // Ensure token is always a string
      const tokenString = this.validateAndExtractToken(token);
      if (tokenString) {
        localStorage.setItem('auth_token', tokenString);
        console.log('🔐 Token set successfully');
      } else {
        console.error('❌ Invalid token provided:', token);
        this.removeToken();
      }
    }
  }

  validateAndExtractToken(token) {
    // Handle null/undefined
    if (!token) {
      return null;
    }

    // If it's already a string, validate it
    if (typeof token === 'string') {
      // Check if it's a valid JWT-like token (has dots)
      if (token.includes('.')) {
        return token;
      }
      // Check if it's a simple token
      if (token.length > 10) {
        return token;
      }
      console.warn('⚠️ Token string seems too short:', token);
      return null;
    }

    // If it's an object, try to extract the token
    if (typeof token === 'object') {
      // Check common token object properties
      if (token.access_token) {
        return this.validateAndExtractToken(token.access_token);
      }
      if (token.token) {
        return this.validateAndExtractToken(token.token);
      }
      if (token.accessToken) {
        return this.validateAndExtractToken(token.accessToken);
      }
      
      console.error('❌ Token object does not contain recognizable token property:', Object.keys(token));
      return null;
    }

    console.error('❌ Token is neither string nor object:', typeof token, token);
    return null;
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
