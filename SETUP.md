# Humanizer Pro Setup Guide

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the `backend` directory with:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   FRONTEND_URL=http://localhost:3000
   PORT=3001
   NODE_ENV=development
   ```

4. **Get Supabase credentials:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project or use existing one
   - Go to Settings > API
   - Copy the Project URL and anon/public key

5. **Set up database:**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL commands from `database_schema_updates.sql`

6. **Start the backend:**
   ```bash
   npm run dev
   ```

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env.local` file in the `frontend` directory with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Start the frontend:**
   ```bash
   npm run dev
   ```

## Testing Authentication

1. Make sure both backend and frontend are running
2. Go to `http://localhost:3000/auth`
3. Enter your email address
4. Check your email for the magic link
5. Click the link to complete authentication

## Troubleshooting

### Magic links not being sent:
- Check that Supabase environment variables are correctly set in backend/.env
- Verify your Supabase project is active
- Check the backend console for error messages
- Ensure your email is not in spam folder

### Database connection issues:
- Verify the database schema was applied correctly
- Check that RLS policies are enabled
- Ensure the auth.users table exists in Supabase
