import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
import pg from 'pg';
import { createClient } from 'redis';
import winston from 'winston';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Database connection
const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'aegis',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
});

// Redis connection for caching and pub/sub
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redis.on('error', (err) => logger.error('Redis error:', err));
await redis.connect();

// Blockchain provider
const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL || 'http://localhost:8545'
);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Connected users
const connectedUsers = new Map();

// Socket.IO connection
io.on('connection', (socket) => {
  logger.info('User connected:', socket.id);
  connectedUsers.set(socket.id, {
    socketId: socket.id,
    address: null,
    userType: null
  });

  socket.on('register', async (data) => {
    const user = connectedUsers.get(socket.id);
    user.address = data.address;
    user.userType = data.userType;
    
    logger.info(`User registered: ${data.address} as ${data.userType}`);
    
    // Join room based on user type
    socket.join(data.userType);
    
    // Send initial data
    socket.emit('registered', { success: true });
    
    // Subscribe to blockchain events for this user
    subscribeToBlockchainEvents(socket, data.address);
  });

  socket.on('disconnect', () => {
    logger.info('User disconnected:', socket.id);
    connectedUsers.delete(socket.id);
  });
});

// Blockchain event subscription
async function subscribeToBlockchainEvents(socket, userAddress) {
  // Example: Listen to token transfers
  const aegisTokenAddress = process.env.AEGIS_TOKEN_ADDRESS;
  
  if (!aegisTokenAddress) return;

  const aegisToken = new ethers.Contract(
    aegisTokenAddress,
    ['event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)'],
    provider
  );

  // Listen for transfers involving this user
  aegisToken.on('TransferSingle', (operator, from, to, id, value, event) => {
    if (from.toLowerCase() === userAddress.toLowerCase() || 
        to.toLowerCase() === userAddress.toLowerCase()) {
      
      socket.emit('tokenTransfer', {
        from,
        to,
        tokenId: id.toString(),
        amount: ethers.formatEther(value),
        type: from.toLowerCase() === userAddress.toLowerCase() ? 'sent' : 'received',
        txHash: event.transactionHash
      });

      // Update database
      saveTransaction(event.transactionHash, from, to, id, value);
    }
  });
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    connections: connectedUsers.size
  });
});

// Get user profile
app.get('/api/user/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM users WHERE address = $1',
      [address.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get token balances
app.get('/api/balances/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Check cache first
    const cached = await redis.get(`balances:${address}`);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Fetch from blockchain
    const aegisToken = new ethers.Contract(
      process.env.AEGIS_TOKEN_ADDRESS,
      ['function balanceOf(address account, uint256 id) view returns (uint256)'],
      provider
    );

    const balances = {};
    for (let i = 1; i <= 5; i++) {
      const balance = await aegisToken.balanceOf(address, i);
      balances[`token${i}`] = ethers.formatEther(balance);
    }

    // Cache for 30 seconds
    await redis.setEx(`balances:${address}`, 30, JSON.stringify(balances));

    res.json(balances);
  } catch (error) {
    logger.error('Error fetching balances:', error);
    res.status(500).json({ error: 'Failed to fetch balances' });
  }
});

// Get transactions
app.get('/api/transactions/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT * FROM transactions 
       WHERE from_address = $1 OR to_address = $1 
       ORDER BY timestamp DESC 
       LIMIT $2 OFFSET $3`,
      [address.toLowerCase(), limit, offset]
    );

    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get donations
app.get('/api/donations', async (req, res) => {
  try {
    const { campaign } = req.query;

    let query = 'SELECT * FROM donations ORDER BY timestamp DESC';
    let params = [];

    if (campaign) {
      query = 'SELECT * FROM donations WHERE campaign = $1 ORDER BY timestamp DESC';
      params = [campaign];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

// Get disaster events
app.get('/api/disasters', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM disasters ORDER BY timestamp DESC LIMIT 100'
    );

    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching disasters:', error);
    res.status(500).json({ error: 'Failed to fetch disasters' });
  }
});

// Real-time statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM transactions) as total_transactions,
        (SELECT SUM(amount) FROM donations) as total_donations,
        (SELECT COUNT(*) FROM disasters) as total_disasters
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    logger.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Webhook for disaster oracle
app.post('/api/webhook/disaster', async (req, res) => {
  try {
    const { location, magnitude, type } = req.body;

    // Save to database
    await pool.query(
      'INSERT INTO disasters (location, magnitude, type, timestamp) VALUES ($1, $2, $3, NOW())',
      [location, magnitude, type]
    );

    // Broadcast to all connected admins
    io.to('admin').emit('newDisaster', {
      location,
      magnitude,
      type,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    logger.error('Error processing disaster webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Helper function to save transactions
async function saveTransaction(txHash, from, to, tokenId, value) {
  try {
    await pool.query(
      `INSERT INTO transactions (tx_hash, from_address, to_address, token_id, amount, timestamp)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (tx_hash) DO NOTHING`,
      [txHash, from.toLowerCase(), to.toLowerCase(), tokenId.toString(), value.toString()]
    );

    // Broadcast to relevant users
    io.emit('newTransaction', {
      txHash,
      from,
      to,
      tokenId: tokenId.toString(),
      amount: ethers.formatEther(value)
    });
  } catch (error) {
    logger.error('Error saving transaction:', error);
  }
}

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📡 WebSocket server ready for real-time updates`);
  logger.info(`🔗 Connected to blockchain: ${process.env.RPC_URL || 'http://localhost:8545'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  await redis.quit();
  await pool.end();
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
