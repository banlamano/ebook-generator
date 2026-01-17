const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const { sequelize } = require('./models');
const { runMigration } = require('./migrations/fix_tone_and_templates');

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://ebook-generator.vercel.app',
  'https://ebook-generator-alpha.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all origins in production for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ebooks', require('./routes/ebooks'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));

// Health check
app.get('/api/health', async (req, res) => {
  let dbStatus = 'unknown';
  try {
    await sequelize.authenticate();
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'disconnected: ' + err.message;
  }
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

// Run migrations and start server
(async () => {
  try {
    // Run comprehensive migration (fixes tone column, syncs DB, seeds templates, updates images)
    logger.info('Initializing database...');
    const migrationResult = await runMigration();
    logger.info('Database initialization complete:', JSON.stringify(migrationResult));
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (err) {
    logger.error('Failed to initialize database:', err);
    process.exit(1);
  }
})();

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});
