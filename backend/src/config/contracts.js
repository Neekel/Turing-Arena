import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// Provider
export const provider = new ethers.JsonRpcProvider(process.env.MANTLE_TESTNET_RPC);

// Wallet (only if valid private key provided)
export const wallet = process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== '0x0000000000000000000000000000000000000000000000000000000000000000'
  ? new ethers.Wallet(process.env.PRIVATE_KEY, provider)
  : null;

// Contract ABIs (simplified for demo)
export const AGENT_REGISTRY_ABI = [
  "function getAgent(uint256 tokenId) view returns (tuple(string name, string personality, uint8 riskTolerance, string strategy, uint256 totalTrades, int256 totalPnL, uint256 createdAt, bool isActive))",
  "function updateAgentStats(uint256 tokenId, uint256 trades, int256 pnl)",
  "function totalAgents() view returns (uint256)"
];

export const VOTING_POOL_ABI = [
  "function startRound(uint256[] traderIds) returns (uint256)",
  "function vote(uint256 roundId, uint256[] traderIds, bool[] votesAI) payable",
  "function revealRound(uint256 roundId, uint256[] traderIds, bool[] isAI)",
  "function currentRoundId() view returns (uint256)",
  "function getRoundStats(uint256 roundId) view returns (uint256 startTime, uint256 endTime, uint256 totalStaked, uint256 totalVoters, bool isRevealed)"
];

export const TURING_ARENA_ABI = [
  "function startRound(uint256[] traderIds, uint256 duration) returns (uint256)",
  "function recordTrade(uint256 roundId, uint256 traderId, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut, uint256 gasUsed, string reasoning)",
  "function finalizeRound(uint256 roundId, int256[] scores, int256[] pnls)",
  "function getTopTraders(uint256 n) view returns (tuple(uint256 traderId, string name, uint256 totalRounds, uint256 wins, int256 totalScore, int256 totalPnL)[])"
];

// Contract instances
export function getAgentRegistry() {
  if (!wallet) throw new Error('Wallet not configured');
  return new ethers.Contract(
    process.env.AGENT_REGISTRY_ADDRESS,
    AGENT_REGISTRY_ABI,
    wallet
  );
}

export function getVotingPool() {
  if (!wallet) throw new Error('Wallet not configured');
  return new ethers.Contract(
    process.env.VOTING_POOL_ADDRESS,
    VOTING_POOL_ABI,
    wallet
  );
}

export function getTuringArena() {
  if (!wallet) throw new Error('Wallet not configured');
  return new ethers.Contract(
    process.env.TURING_ARENA_ADDRESS,
    TURING_ARENA_ABI,
    wallet
  );
}
