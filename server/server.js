const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { connectDB } = require('./config/db');
const { initSocket } = require('./services/socketService');
const errorHandler = require('./middleware/errorHandler');
const seedData = require('./seed');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});
initSocket(io);

// Security & Utility Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter for API safety
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api', apiLimiter);

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    app: 'BloodConnect 360 API',
    timestamp: new Date().toISOString(),
    twoStageSearchActive: true,
    aiMatchingEngineActive: true
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/blood-banks', require('./routes/bloodBankRoutes'));
app.use('/api/inventory', require('./routes/bloodBankRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Serve static React client files from client/dist if built
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // Client SPA Routing: Serve index.html for non-API routes
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // If not built yet, redirect root to client dev server URL
  app.get('/', (req, res) => {
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
  });
}

// 404 for undefined API routes
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Cannot find ${req.originalUrl} on BloodConnect 360 API` });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

// Connect DB and Start Server
connectDB()
  .then(async () => {
    // Check if database needs initial seeding
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('📦 Empty database detected. Auto-seeding initial medical and donor records...');
      await seedData();
    }

    server.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🩸 BloodConnect 360 Server running on port ${PORT}`);
      console.log(`🏥 Stage 1 Blood Banks + Stage 2 Donor Fallback Active`);
      console.log(`🤖 AI Matching Engine & Triage System Online`);
      console.log(`⚡ WebSocket Real-time Notifications Ready`);
      console.log(`=======================================================`);
    });
  })
  .catch((err) => {
    console.error('Fatal Server Initialization Error:', err);
    process.exit(1);
  });
