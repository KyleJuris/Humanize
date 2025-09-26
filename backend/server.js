const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log(' SERVER.JS SCRIPT STARTING...');
console.log(' Using port:', PORT);

app.use(helmet());

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://humanize-pro.vercel.app',
    'https://humanize-pro-git-main-kylejuris.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(morgan('combined'));
// Load and mount stripe-hosted routes BEFORE express.json() middleware
// This ensures the webhook route can use express.raw() for proper Stripe signature verification
console.log(' Loading stripe-hosted routes for early mounting...');
let stripeHostedRoutes = null;
try {
  stripeHostedRoutes = require('./routes/stripe-hosted');
  console.log(' Stripe-hosted routes loaded for early mounting');
} catch (error) {
  console.error(' Failed to load stripe-hosted routes:', error.message);
  console.error(' Continuing without stripe-hosted routes');
}

// Mount stripe-hosted routes BEFORE express.json() middleware
if (stripeHostedRoutes) {
  app.use('/api/stripe-hosted', stripeHostedRoutes);
  console.log(' Stripe-hosted routes mounted at /api/stripe-hosted (before express.json)');
} else {
  console.log(' Skipping stripe-hosted routes mounting');
}

// Now apply express.json() middleware for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    message: 'Humanize Pro Backend API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

console.log(' About to load routes...');
try {
  console.log(' Loading route modules...');
  const authRoutes = require('./routes/auth');
  const projectsRoutes = require('./routes/projects');
  const profilesRoutes = require('./routes/profiles');
  console.log(' Route modules loaded successfully');

  console.log(' Registering API routes...');
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectsRoutes);
  app.use('/api/profiles', profilesRoutes);
  console.log(' API routes registered successfully');
} catch (error) {
  console.error(' Error loading routes:', error);
}

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Humanizer Pro API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      profiles: '/api/profiles'
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use('*', (req, res) => {
  console.log(` 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

console.log(' ATTEMPTING TO START SERVER...');
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(` Server successfully bound to port ${PORT}`);
  console.log(` Server listening on 0.0.0.0:${PORT}`);
  console.log(` Backend API is ready!`);
});

server.on('error', (err) => {
  console.error(' Server failed to start:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log(' Received SIGINT. Graceful shutdown...');
  server.close(() => {
    console.log(' HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
