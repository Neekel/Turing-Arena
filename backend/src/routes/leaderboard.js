import express from 'express';
import { agents } from './agents.js';
import { MarketDataService } from '../services/MarketDataService.js';

const router = express.Router();
const marketService = new MarketDataService();

/**
 * GET /api/leaderboard
 * Get leaderboard with all agents
 */
router.get('/', async (req, res) => {
  const marketData = await marketService.getMarketData();
  
  const leaderboard = agents.map((agent, index) => {
    const pnl = agent.balance - 1000;
    const pnlPercent = (pnl / 1000 * 100).toFixed(2);
    const score = marketService.calculateScore(agent, marketData);
    
    return {
      rank: index + 1,
      id: agent.id,
      name: agent.name,
      personality: agent.personality,
      balance: agent.balance.toFixed(2),
      totalTrades: agent.trades.length,
      pnl: pnlPercent + '%',
      score: score,
      wins: agent.trades.filter(t => t.action === 'SELL' && parseFloat(t.amount) > 0).length
    };
  });

  // Sort by score
  leaderboard.sort((a, b) => b.score - a.score);
  
  // Update ranks
  leaderboard.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  res.json({ leaderboard });
});

/**
 * GET /api/leaderboard/top/:n
 * Get top N traders
 */
router.get('/top/:n', async (req, res) => {
  const n = parseInt(req.params.n) || 3;
  const marketData = await marketService.getMarketData();
  
  const leaderboard = agents.map(agent => {
    const pnl = agent.balance - 1000;
    const pnlPercent = (pnl / 1000 * 100).toFixed(2);
    const score = marketService.calculateScore(agent, marketData);
    
    return {
      id: agent.id,
      name: agent.name,
      personality: agent.personality,
      score: score,
      pnl: pnlPercent + '%',
      totalTrades: agent.trades.length
    };
  });

  // Sort and take top N
  leaderboard.sort((a, b) => b.score - a.score);
  const topN = leaderboard.slice(0, n);

  res.json({ top: topN });
});

export { router as leaderboardRoutes };
