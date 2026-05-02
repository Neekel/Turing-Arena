import express from 'express';
import { AgentFactory } from '../agents/AgentFactory.js';

const router = express.Router();
const agents = AgentFactory.createAgents();

/**
 * GET /api/agents
 * Get all agents
 */
router.get('/', (req, res) => {
  const agentList = agents.map(agent => ({
    id: agent.id,
    name: agent.name,
    personality: agent.personality,
    riskTolerance: agent.riskTolerance,
    strategy: agent.strategy,
    balance: agent.balance,
    totalTrades: agent.trades.length
  }));

  res.json({ agents: agentList });
});

/**
 * GET /api/agents/:id
 * Get agent by ID
 */
router.get('/:id', (req, res) => {
  const agent = AgentFactory.getAgentById(agents, parseInt(req.params.id));
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  res.json({ agent: agent.getStats() });
});

/**
 * GET /api/agents/:id/trades
 * Get agent's trade history
 */
router.get('/:id/trades', (req, res) => {
  const agent = AgentFactory.getAgentById(agents, parseInt(req.params.id));
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  res.json({ trades: agent.trades });
});

export { router as agentRoutes, agents };
