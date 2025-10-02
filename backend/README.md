# Humanizer Pro Backend

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the backend directory with:
   ```
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   FRONTEND_URL=http://localhost:3000
   PORT=3001
   NODE_ENV=development
   ```

3. **Database Setup**
   - Run the SQL commands in `../database_schema_updates.sql` in your Supabase SQL editor
   - This will create the `profiles` and `projects` tables with proper RLS policies

4. **Start the Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Send magic link for signup
- `POST /signin` - Send magic link for signin
- `GET /me` - Get current user profile
- `POST /signout` - Sign out user

### Projects (`/api/projects`)
- `GET /` - Get all user projects
- `GET /:id` - Get specific project
- `POST /` - Create new project
- `PUT /:id` - Update project
- `DELETE /:id` - Delete project

### Profiles (`/api/profiles`)
- `GET /` - Get user profile
- `PUT /` - Update user profile
- `POST /` - Create user profile

## Database Schema

### Profiles Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)
- `avatar_url` (TEXT)
- `subscription_type` (TEXT, NULL = free plan)
- `stripe_customer_id` (TEXT)
- `email` (TEXT)
- `user_name` (TEXT)

### Projects Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `intensity` (INT, default: 50)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)
- `language` (TEXT, default: 'en')
- `tone` (TEXT, default: 'neutral')
- `title` (TEXT)
- `input_text` (TEXT)
- `output_text` (TEXT)
