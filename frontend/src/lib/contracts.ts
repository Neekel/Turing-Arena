export const AGENT_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS as `0x${string}`;
export const VOTING_POOL_ADDRESS = process.env.NEXT_PUBLIC_VOTING_POOL_ADDRESS as `0x${string}`;
export const TURING_ARENA_ADDRESS = process.env.NEXT_PUBLIC_TURING_ARENA_ADDRESS as `0x${string}`;

export const AGENT_REGISTRY_ABI = [
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getAgent",
    outputs: [
      {
        components: [
          { name: "name", type: "string" },
          { name: "personality", type: "string" },
          { name: "riskTolerance", type: "uint8" },
          { name: "strategy", type: "string" },
          { name: "totalTrades", type: "uint256" },
          { name: "totalPnL", type: "int256" },
          { name: "createdAt", type: "uint256" },
          { name: "isActive", type: "bool" }
        ],
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalAgents",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
] as const;

export const VOTING_POOL_ABI = [
  {
    inputs: [],
    name: "currentRoundId",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "roundId", type: "uint256" },
      { name: "traderIds", type: "uint256[]" },
      { name: "votesAI", type: "bool[]" }
    ],
    name: "vote",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ name: "roundId", type: "uint256" }],
    name: "getRoundStats",
    outputs: [
      { name: "startTime", type: "uint256" },
      { name: "endTime", type: "uint256" },
      { name: "totalStaked", type: "uint256" },
      { name: "totalVoters", type: "uint256" },
      { name: "isRevealed", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;

export const TURING_ARENA_ABI = [
  {
    inputs: [{ name: "n", type: "uint256" }],
    name: "getTopTraders",
    outputs: [
      {
        components: [
          { name: "traderId", type: "uint256" },
          { name: "name", type: "string" },
          { name: "totalRounds", type: "uint256" },
          { name: "wins", type: "uint256" },
          { name: "totalScore", type: "int256" },
          { name: "totalPnL", type: "int256" }
        ],
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;
