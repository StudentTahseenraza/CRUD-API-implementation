const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { errorMiddleware } = require('./middlewares/errorHandler');
const { apiLimiter } = require('./middlewares/rateLimiter');
const swaggerDocs = require('./config/swagger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const adminRoutes = require('./routes/adminRoutes');

class Application {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // Security headers
    this.app.use(helmet());
    
    // CORS configuration
this.app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://crud-api-implementation.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));


    // Body parsing
    this.app.use(express.json({ limit: '10kb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    // Logging
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Rate limiting for all routes
    this.app.use('/api/', apiLimiter);
  }

  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
      });
    });

    // API Routes with versioning
    this.app.use('/api/v1/auth', authRoutes);
    this.app.use('/api/v1/tasks', taskRoutes);
    this.app.use('/api/v1/admin', adminRoutes);

    // API Documentation
    swaggerDocs(this.app);

    // 404 handler
    this.app.all('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: `Cannot ${req.method} ${req.originalUrl}`
      });
    });
  }

  setupErrorHandling() {
    this.app.use(errorMiddleware);
  }

  async start(port) {
    try {
      // Connect to database
      await connectDB();
      
      // Start server
      this.server = this.app.listen(port, () => {
        console.log(`✅ Server running on port ${port}`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
        console.log(`📚 API Docs: http://localhost:${port}/api-docs`);
      });

      // Graceful shutdown
      process.on('SIGTERM', this.shutdown.bind(this));
      process.on('SIGINT', this.shutdown.bind(this));

      return this.server;
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  shutdown() {
    console.log('Shutting down server...');
    this.server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  }
}

module.exports = Application;