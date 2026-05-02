import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { agentRoutes } from './routes/agents.js';
import { tradingRoutes } from './routes/trading.js';
import { leaderboardRoutes } from './routes/leaderboard.js';
import { roundsRoutes } from './routes/rounds.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/rounds', roundsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`🚀 TuringArena Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// WebSocket server for live updates
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('📡 New WebSocket connection');

  ws.on('message', (message) => {
    console.log('Received:', message.toString());
  });

  ws.on('close', () => {
    console.log('📡 WebSocket connection closed');
  });
});

// Broadcast function for live updates
export function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(JSON.stringify(data));
    }
  });
}

export { wss };
