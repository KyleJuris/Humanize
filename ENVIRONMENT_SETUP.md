# Environment Variables Setup Guide

## 🔧 **Required Environment Variables**

### **Frontend (.env.local)**
Create `frontend/.env.local` with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lxibkxddlgxufvqceqtn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4aWJreGRkbGd4dWZ2cWNlcXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMzgzNjMsImV4cCI6MjA3MzgxNDM2M30.placeholder

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### **Backend (.env)**
Create `backend/.env` with the following variables:

```bash
# Supabase Configuration
SUPABASE_URL=https://lxibkxddlgxufvqceqtn.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4aWJreGRkbGd4dWZ2cWNlcXRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODIzODM2MywiZXhwIjoyMDczODE0MzYzfQ.QDkoereRoYzUzxHeom2krjTIJj9WELP4v7iCTuihSzE

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=5000

# LLM Configuration (OpenAI compatible)
LLM_API_KEY=placeholder-api-key
LLM_MODEL=gpt-4o-mini
LLM_ENDPOINT=https://api.openai.com/v1/chat/completions
LLM_MAX_TOKENS=2000
LLM_TEMPERATURE=0.7
OPENAI_API_KEY=your-openai-api-key-here
```

## 🚀 **Setup Instructions**

### **1. Frontend Setup**
```bash
cd frontend
cp env.template .env.local
# Edit .env.local with your actual values
npm install
npm run dev
```

### **2. Backend Setup**
```bash
cd backend
# Create .env file with the values above
npm install
npm run dev
```

## ⚠️ **Important Notes**

1. **Replace placeholder values** with your actual Supabase credentials
2. **Never commit .env files** to git (they're in .gitignore)
3. **Use NEXT_PUBLIC_ prefix** for frontend environment variables
4. **Restart servers** after changing environment variables

## 🔍 **Troubleshooting**

### **Supabase Client Not Initialized**
- Check if `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Verify the values are correct (no typos)
- Restart the frontend development server

### **Authentication Issues**
- Check browser console for error messages
- Verify Supabase project is active
- Check if magic link redirect URL is correct

### **API Connection Issues**
- Verify `NEXT_PUBLIC_API_URL` points to running backend
- Check if backend is running on the correct port
- Verify CORS configuration in backend
