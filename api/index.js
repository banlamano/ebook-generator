const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database initialization
let dbInitialized = false;

const initializeDatabase = async () => {
  if (dbInitialized) return true;
  
  try {
    const sequelize = require('../server/config/database');
    await sequelize.authenticate();
    
    // Import models to register them
    require('../server/models');
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync();
    
    dbInitialized = true;
    console.log('Database connected successfully');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

// Database middleware - initializes DB before API routes
app.use('/api', async (req, res, next) => {
  // Skip DB init for health check
  if (req.path === '/health') {
    return next();
  }
  
  const dbReady = await initializeDatabase();
  if (!dbReady) {
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection failed. Please check environment variables.' 
    });
  }
  next();
});

// Health check endpoint (no DB required)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(), 
    environment: process.env.NODE_ENV || 'development',
    database: dbInitialized ? 'connected' : 'not connected'
  });
});

// API Routes
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/ebooks', require('../server/routes/ebooks'));
app.use('/api/templates', require('../server/routes/templates'));
app.use('/api/subscriptions', require('../server/routes/subscriptions'));
app.use('/api/admin', require('../server/routes/admin'));
app.use('/api/user', require('../server/routes/user'));

// Catch-all for unmatched API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Export for Vercel serverless
module.exports = (req, res) => {
  // Handle the request with Express app
  return app(req, res);
};
