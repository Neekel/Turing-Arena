import express from 'express';
import { ethers } from 'ethers';
import { agents } from './agents.js';
import { MarketDataService } from '../services/MarketDataService.js';
import { broadcast } from '../index.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const marketService = new MarketDataService();

// Contract setup
const VOTING_POOL_ADDRESS = '0x444A930d5fdc9c33faeC0D5Dfb84cF1Dc0A05B1D'; // NEW ADDRESS!
const VOTING_POOL_ABI = [
  "function startRound(uint256[] memory traderIds) external returns (uint256)",
  "function getRoundStats(uint256 roundId) external view returns (uint256 startTime, uint256 endTime, uint256 totalStaked, uint256 totalVoters, bool isRevealed)",
  "function setVotingDuration(uint256 _duration) external",
  "function votingDuration() external view returns (uint256)",
  "function currentRoundId() external view returns (uint256)",
  "function revealRound(uint256 roundId, uint256[] memory traderIds, bool[] memory isAI) external"
];

// Setup provider and wallet
const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.mantle.xyz');
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const votingPool = new ethers.Contract(VOTING_POOL_ADDRESS, VOTING_POOL_ABI, wallet);

// Active rounds storage
const activeRounds = new Map();

/**
 * POST /api/rounds/start
 * Start a new trading round
 */
router.post('/start', async (req, res) => {
  try {
    const { duration: requestedDuration = 300 } = req.body; // Duration in seconds (default 5 minutes)

    console.log('=== STARTING NEW ROUND ===');
    console.log('Requested Duration:', requestedDuration, 'seconds');

    // Check if there's a previous round that needs revealing
    try {
      const currentRoundId = await votingPool.currentRoundId();
      if (currentRoundId > 0) {
        const stats = await votingPool.getRoundStats(currentRoundId);
        if (!stats.isRevealed) {
          console.log('Previous round', Number(currentRoundId), 'not revealed. Revealing now...');
          
          // Get trader IDs
          const traderIds = agents.map(a => a.id);
          const isAI = traderIds.map(() => true); // All are AI
          
          const revealTx = await votingPool.revealRound(currentRoundId, traderIds, isAI);
          await revealTx.wait();
          console.log('Previous round revealed!');
        }
      }
    } catch (err) {
      console.log('No previous round or already revealed');
    }

    // Get trader IDs
    const traderIds = agents.map(a => a.id);
    console.log('Trader IDs:', traderIds);

    // Start round on blockchain
    console.log('Calling votingPool.startRound()...');
    const tx = await votingPool.startRound(traderIds);
    console.log('Transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Transaction confirmed! Block:', receipt.blockNumber);

    // Get the actual round ID from contract
    const contractRoundId = await votingPool.currentRoundId();
    const roundId = Number(contractRoundId);
    
    console.log('Round created on-chain!');
    console.log('Contract Round ID:', roundId);

    // Get round stats from contract
    const stats = await votingPool.getRoundStats(roundId);
    const startTime = Number(stats.startTime);
    const endTime = Number(stats.endTime);
    const actualDuration = endTime - startTime;

    console.log('Start time:', new Date(startTime * 1000).toISOString());
    console.log('End time:', new Date(endTime * 1000).toISOString());
    console.log('Actual Duration:', actualDuration, 'seconds');

    // Initialize round in backend
    const round = {
      id: roundId,
      startTime,
      endTime,
      duration: actualDuration,
      trades: [],
      status: 'active',
      txHash: tx.hash,
    };

    activeRounds.set(roundId, round);

    // Broadcast round start
    broadcast({
      type: 'ROUND_START',
      roundId,
      duration: actualDuration,
      startTime,
      endTime,
      txHash: tx.hash,
      agents: agents.map(a => ({ 
        id: a.id, 
        name: a.name,
        personality: a.personality 
      }))
    });

    // Execute trades for all agents
    console.log('Executing trades for', agents.length, 'agents...');
    const marketData = await marketService.getMarketData();
    const trades = [];

    for (const agent of agents) {
      const decision = await agent.makeDecision(marketData);
      const trade = await agent.executeTrade(decision, marketData);

      if (trade) {
        trades.push({
          ...trade,
          personality: agent.personality,
          roundId
        });

        // Broadcast each trade
        broadcast({
          type: 'TRADE',
          roundId,
          trade: {
            ...trade,
            personality: agent.personality
          }
        });
      }
    }

    round.trades = trades;
    console.log('Trades executed:', trades.length);

    // Schedule round end
    setTimeout(() => {
      endRound(roundId);
    }, actualDuration * 1000);

    console.log('=== ROUND STARTED SUCCESSFULLY ===');

    res.json({
      success: true,
      roundId,
      duration: actualDuration,
      startTime,
      endTime,
      trades,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber
    });
  } catch (error) {
    console.error('=== ERROR STARTING ROUND ===');
    console.error('Error:', error);
    console.error('Message:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/rounds/:roundId
 * Get round details
 */
router.get('/:roundId', (req, res) => {
  const roundId = parseInt(req.params.roundId);
  const round = activeRounds.get(roundId);

  if (!round) {
    return res.status(404).json({ error: 'Round not found' });
  }

  res.json({ round });
});

/**
 * GET /api/rounds/active
 * Get current active round
 */
router.get('/active/current', (req, res) => {
  const now = Math.floor(Date.now() / 1000);
  
  for (const [roundId, round] of activeRounds.entries()) {
    if (round.status === 'active' && round.endTime > now) {
      return res.json({ round });
    }
  }

  res.json({ round: null });
});

/**
 * POST /api/rounds/:roundId/reveal
 * Reveal round results (simulate on-chain reveal)
 */
router.post('/:roundId/reveal', async (req, res) => {
  try {
    const roundId = parseInt(req.params.roundId);
    const round = activeRounds.get(roundId);

    if (!round) {
      return res.status(404).json({ error: 'Round not found' });
    }

    if (round.status === 'revealed') {
      return res.json({ message: 'Round already revealed', results: round.results });
    }

    // Calculate results
    const results = round.trades.map(trade => {
      const agent = agents.find(a => a.id === trade.traderId);
      
      return {
        traderId: trade.traderId,
        traderName: trade.traderName,
        isAI: true, // All are AI in this demo
        correctVotes: Math.floor(Math.random() * 100), // Mock data
        totalVotes: 100,
        accuracy: Math.random() * 100,
        pnl: trade.amount * (Math.random() * 0.2 - 0.1), // Mock PnL
      };
    });

    round.status = 'revealed';
    round.results = results;

    // Broadcast reveal
    broadcast({
      type: 'ROUND_REVEAL',
      roundId,
      results
    });

    res.json({
      success: true,
      roundId,
      results
    });
  } catch (error) {
    console.error('Error revealing round:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Internal function to end a round
 */
function endRound(roundId) {
  const round = activeRounds.get(roundId);
  if (!round) return;

  round.status = 'ended';

  broadcast({
    type: 'ROUND_END',
    roundId,
    trades: round.trades
  });

  console.log(`Round ${roundId} ended`);
}

export { router as roundsRoutes };
