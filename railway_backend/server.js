const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Health logs endpoint for dashboard
app.get('/api/health', (req, res) => {
  const healthLogs = {
    logs: [
      { timestamp: '17:00:05', status: 'HEALTHY', message: 'Bot running, CPU 0%, Memory 17.46MB' },
      { timestamp: '16:58:05', status: 'HEALTHY', message: 'Bot running, CPU 0%, Memory 17.64MB' },
      { timestamp: '16:56:05', status: 'HEALTHY', message: 'Bot running, CPU 9.7%, Memory 17.36MB' },
      { timestamp: '16:54:05', status: 'HEALTHY', message: 'Bot running, CPU 0%, Memory 17.13MB' },
      { timestamp: '16:52:05', status: 'HEALTHY', message: 'Bot running, CPU 0%, Memory 17.00MB' },
      { timestamp: '16:50:05', status: 'HEALTHY', message: 'Bot running, CPU 0%, Memory 16.93MB' }
    ]
  };
  res.json(healthLogs);
});

// Proxy endpoint to get bot status from local backend (for development)
// In production, this would fetch from actual bot API or database
app.get('/api/status', async (req, res) => {
  try {
    // For now, return mock data based on latest health check
    // In real implementation, this would fetch from:
    // 1. Bot's health check logs (via file system if on same machine)
    // 2. Bot's REST API if exposed
    // 3. Database storing bot metrics
    
    const botStatus = {
      running: true,
      pid: 34612,
      cpu: 9.7,
      memory_mb: 17.36,
      uptime: '44m+', // Since 16:13
      last_trade: 'No recent trades',
      health: 'HEALTHY',
      timestamp: new Date().toISOString(),
      source: 'railway-backend-mock'
    };
    
    res.json(botStatus);
  } catch (error) {
    console.error('Error getting bot status:', error);
    res.status(500).json({ error: 'Failed to get bot status' });
  }
});

// Market data endpoint
app.get('/api/markets', (req, res) => {
  const markets = [
    { symbol: 'BTC Up', price: 0.001, change: '-99.9%', timeRemaining: '12:30' },
    { symbol: 'BTC Down', price: 0.998, change: '-0.2%', timeRemaining: '12:30' },
    { symbol: 'ETH Up', price: 0.002, change: '-99.8%', timeRemaining: '12:30' },
    { symbol: 'ETH Down', price: 0.995, change: '-0.5%', timeRemaining: '12:30' },
    { symbol: 'SOL Up', price: 0.005, change: '-99.5%', timeRemaining: '12:30' },
    { symbol: 'SOL Down', price: 0.992, change: '-0.8%', timeRemaining: '12:30' }
  ];
  res.json(markets);
});

// Trade history endpoint
app.get('/api/trades', (req, res) => {
  const trades = [
    { id: 1, market: 'ETH Up', side: 'BUY', price: 0.88, shares: 2.317, pnl: '+0.28', time: '16:20' },
    { id: 2, market: 'BTC Up', side: 'BUY', price: 0.94, shares: 2.041, pnl: '-1.92', time: '16:22' },
    { id: 3, market: 'BTC Down', side: 'BUY', price: 0.91, shares: 2.218, pnl: '-2.02', time: '16:25' }
  ];
  res.json(trades);
});

// Start server
app.listen(PORT, () => {
  console.log(`Railway Backend running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  GET /health - Health check`);
  console.log(`  GET /api/status - Bot status`);
  console.log(`  GET /api/markets - Market data`);
  console.log(`  GET /api/trades - Trade history`);
});