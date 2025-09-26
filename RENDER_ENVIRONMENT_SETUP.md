# Render Environment Variables Setup

## 🚨 CRITICAL: Backend Server Failing

The backend server is failing to start due to missing Supabase environment variables. This is causing all API requests to return 404 errors.

## Required Environment Variables

You need to set the following environment variables in your Render backend service:

### Supabase Configuration
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_KEY=your-supabase-service-role-key-here
```

### Server Configuration
```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://humanize-pro.vercel.app
NEXT_PUBLIC_SITE_URL=https://humanize-pro.vercel.app
SITE_URL=https://humanize-pro.vercel.app
```

### OpenAI Configuration
```
OPENAI_API_KEY=your-openai-api-key-here
LLM_MODEL=gpt-4o-mini
LLM_MAX_TOKENS=2000
LLM_TEMPERATURE=0.7
```

### Stripe Configuration
```
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret-here
```

## How to Set Environment Variables in Render

1. Go to your Render dashboard
2. Navigate to your backend service
3. Click on "Environment" tab
4. Add each environment variable listed above
5. Click "Save Changes"
6. The service will automatically redeploy

## Current Error
```
Error loading routes: Error: Missing Supabase environment variables
```

## After Setting Environment Variables
Once you set the environment variables, the server should start successfully and all API endpoints should work:
- ✅ GET /api/auth/me
- ✅ GET /api/projects
- ✅ POST /api/stripe-hosted/create-checkout-session

## Verification
After deployment, test these endpoints:
- `https://humanize-fvj3.onrender.com/api/debug`
- `https://humanize-fvj3.onrender.com/api/auth/me`

Generated: 2025-09-26T04:05:00Z
