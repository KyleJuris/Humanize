# Humanize Pro Backend

Express.js backend API for the Humanize Pro application.

## Features

- **Authentication**: User registration, login, logout, and password reset
- **Text Humanization**: AI-powered text humanization using OpenAI
- **User Management**: Profile management and usage tracking
- **Security**: Helmet for security headers, CORS enabled
- **Logging**: Morgan for request logging
- **Environment Configuration**: Dotenv for environment variables

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. Start the development server:
```bash
npm run dev
```

4. Start the production server:
```bash
npm start
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (Supabase)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Email Configuration (for password reset)
EMAIL_FROM=noreply@humanizepro.com
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset

### Text Humanization
- `POST /api/humanize/text` - Humanize single text
- `POST /api/humanize/batch` - Humanize multiple texts
- `GET /api/humanize/history` - Get humanization history

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/usage` - Get usage statistics
- `GET /api/user/subscription` - Get subscription details

## Project Structure

```
Backend/
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── humanize.js      # Text humanization routes
│   └── user.js          # User management routes
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
├── .env                 # Environment variables
└── README.md           # This file
```

## Development

The server runs on `http://localhost:5000` by default.

Use `npm run dev` for development with auto-restart on file changes.

## Production

Use `npm start` to run the production server.

## Security

- Helmet.js for security headers
- CORS enabled for cross-origin requests
- Environment variables for sensitive data
- Input validation (to be implemented)
- Rate limiting (to be implemented)
