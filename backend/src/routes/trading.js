import express from 'express';
import { agents } from './agents.js';
import { MarketDataService } from '../services/MarketDataService.js';
import { broadcast } from '../index.js';

const router = express.Router();
const marketService = new MarketDataService();

/**
 * GET /api/trading/market
 * Get current market data
 */
router.get('/market', async (req, res) => {
  const marketData = await marketService.getMarketData();
  res.json({ market: marketData });
});

/**
 * POST /api/trading/round/start
 * Start a new trading round
 */
router.post('/round/start', async (req, res) => {
  const { duration = 60 } = req.body; // Duration in seconds

  const roundId = Date.now();
  
  // Broadcast round start
  broadcast({
    type: 'ROUND_START',
    roundId,
    duration,
    agents: agents.map(a => ({ id: a.id, name: a.name }))
  });

  res.json({
    roundId,
    duration,
    startTime: new Date().toISOString()
  });
});

/**
 * POST /api/trading/execute
 * Execute trades for all agents
 */
router.post('/execute', async (req, res) => {
  try {
    const marketData = await marketService.getMarketData();
    const trades = [];

    // Each agent makes a decision
    for (const agent of agents) {
      const decision = await agent.makeDecision(marketData);
      const trade = await agent.executeTrade(decision, marketData);

      if (trade) {
        trades.push(trade);
        
        // Broadcast trade in real-time
        broadcast({
          type: 'TRADE',
          trade: {
            ...trade,
            personality: agent.personality
          }
        });
      }
    }

    res.json({
      success: true,
      trades,
      marketData
    });
  } catch (error) {
    console.error('Error executing trades:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/trading/scores
 * Get current scores for all agents
 */
router.get('/scores', async (req, res) => {
  const marketData = await marketService.getMarketData();
  
  const scores = agents.map(agent => ({
    id: agent.id,
    name: agent.name,
    score: marketService.calculateScore(agent, marketData),
    balance: agent.balance,
    trades: agent.trades.length,
    pnl: ((agent.balance - 1000) / 1000 * 100).toFixed(2) + '%'
  }));

  // Sort by score
  scores.sort((a, b) => b.score - a.score);

  res.json({ scores });
});

export { router as tradingRoutes };
