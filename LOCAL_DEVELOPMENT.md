# Local Development Setup

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```env
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   FRONTEND_URL=http://localhost:3000
   PORT=3001
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will run on http://localhost:3001

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend will run on http://localhost:3000

## Testing the Application

1. Open http://localhost:3000 in your browser
2. Click "Sign In" to test authentication
3. Enter an email address to receive a magic link
4. Check your email and click the magic link
5. You should be redirected back to the application and logged in

## Features Implemented

- ✅ Text input box takes full width with equal spacing
- ✅ Consistent Sign In/Sign Out buttons across all pages
- ✅ Route protection for dashboard pages
- ✅ Authentication state persistence
- ✅ Proper redirects for Sign In/Sign Out
- ✅ Local development configuration
- ✅ Magic link authentication flow

## Troubleshooting

- If the backend doesn't start, check that the Supabase environment variables are set correctly
- If authentication doesn't work, verify that the FRONTEND_URL in the backend .env matches your frontend URL
- If you get CORS errors, make sure both servers are running on the correct ports
