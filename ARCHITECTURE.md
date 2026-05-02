# TuringArena - System Architecture

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Frontend (Next.js 14 + React)                  │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
│  │  │ VotingPanel  │  │RevealAnimation│  │  AgentCard   │     │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
│  │  │  LiveFeed    │  │ Leaderboard  │  │  Main Page   │     │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              │ HTTP/WebSocket                    │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Node.js + Express)                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      API Routes                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
│  │  │   /rounds    │  │   /agents    │  │  /trading    │     │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │ │
│  │  ┌──────────────┐                                          │ │
│  │  │ /leaderboard │                                          │ │
│  │  └──────────────┘                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    WebSocket Server                         │ │
│  │  • ROUND_START    • TRADE    • ROUND_END    • ROUND_REVEAL │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      AI Agents                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
│  │  │  Aggressor   │  │ Conservative │  │  MemeLord    │     │ │
│  │  │  (Risk 80%)  │  │  (Risk 20%)  │  │  (Risk 90%)  │     │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  Market Data Service                        │ │
│  │  • Gas Price    • MNT Price    • Volume    • Volatility    │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ Web3 (ethers.js)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              Mantle Sepolia Testnet (Blockchain)                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Smart Contracts                          │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  AgentRegistry (ERC-721)                             │  │ │
│  │  │  0xbDEC5df59c34436FD886FaF458aBCF18992dFb44          │  │ │
│  │  │  • registerAgent()  • getAgent()  • totalAgents()    │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  VotingPool                                          │  │ │
│  │  │  0x0F778aaD8c423722d169Ec09b6936Cf32d578bd2          │  │ │
│  │  │  • vote()  • getRoundStats()  • currentRoundId()     │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  TuringArena                                         │  │ │
│  │  │  0x1b48fC5E359AAE103b1C135bAA2f8FD9A768EB9E          │  │ │
│  │  │  • getTopTraders()  • leaderboard                    │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ RainbowKit + wagmi
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MetaMask Wallet                          │
│  • Sign Transactions    • Approve Votes    • Pay Gas Fees       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Voting Flow

```
┌─────────────┐
│   USER      │
└──────┬──────┘
       │
       │ 1. Click "Start New Round"
       ▼
┌─────────────────────────────────────────┐
│  Frontend (page.tsx)                    │
│  • handleStartRound()                   │
│  • POST /api/rounds/start               │
└──────────────┬──────────────────────────┘
               │
               │ 2. HTTP Request
               ▼
┌─────────────────────────────────────────┐
│  Backend (rounds.js)                    │
│  • Create round with ID & duration      │
│  • Initialize round state               │
└──────────────┬──────────────────────────┘
               │
               │ 3. Execute AI Trades
               ▼
┌─────────────────────────────────────────┐
│  AI Agents (AgentFactory)               │
│  • Aggressor.makeDecision()             │
│  • Conservative.makeDecision()          │
│  • MemeLord.makeDecision()              │
│  • Each agent analyzes market           │
│  • Each agent executes trade            │
└──────────────┬──────────────────────────┘
               │
               │ 4. Broadcast Events
               ▼
┌─────────────────────────────────────────┐
│  WebSocket Server                       │
│  • broadcast(ROUND_START)               │
│  • broadcast(TRADE) x3                  │
└──────────────┬──────────────────────────┘
               │
               │ 5. Real-time Updates
               ▼
┌─────────────────────────────────────────┐
│  Frontend (useWebSocket)                │
│  • Receive ROUND_START                  │
│  • Receive TRADE events                 │
│  • Update state                         │
└──────────────┬──────────────────────────┘
               │
               │ 6. Display Voting Panel
               ▼
┌─────────────────────────────────────────┐
│  VotingPanel Component                  │
│  • Show trades                          │
│  • Show countdown timer                 │
│  • Show AI/Human buttons                │
└──────────────┬──────────────────────────┘
               │
               │ 7. User Votes
               ▼
┌─────────────────────────────────────────┐
│  User Actions                           │
│  • Click 🤖 AI or 👤 Human              │
│  • Set stake amount                     │
│  • Click "Submit Votes"                 │
└──────────────┬──────────────────────────┘
               │
               │ 8. Connect Wallet
               ▼
┌─────────────────────────────────────────┐
│  RainbowKit + wagmi                     │
│  • useVote() hook                       │
│  • writeContract()                      │
└──────────────┬──────────────────────────┘
               │
               │ 9. Sign Transaction
               ▼
┌─────────────────────────────────────────┐
│  MetaMask                               │
│  • User confirms transaction            │
│  • Pay gas fees                         │
└──────────────┬──────────────────────────┘
               │
               │ 10. Submit to Blockchain
               ▼
┌─────────────────────────────────────────┐
│  VotingPool Contract                    │
│  • vote(roundId, traderIds, votesAI)    │
│  • Record votes on-chain                │
│  • Lock stake amount                    │
└──────────────┬──────────────────────────┘
               │
               │ 11. Wait for Round End
               ▼
┌─────────────────────────────────────────┐
│  Timer Expires or Manual Reveal         │
│  • User clicks "Reveal Results"         │
│  • POST /api/rounds/:id/reveal          │
└──────────────┬──────────────────────────┘
               │
               │ 12. Calculate Results
               ▼
┌─────────────────────────────────────────┐
│  Backend (rounds.js)                    │
│  • Calculate vote accuracy              │
│  • Determine winners                    │
│  • Prepare results                      │
└──────────────┬──────────────────────────┘
               │
               │ 13. Broadcast Reveal
               ▼
┌─────────────────────────────────────────┐
│  WebSocket Server                       │
│  • broadcast(ROUND_REVEAL)              │
│  • Send results to all clients          │
└──────────────┬──────────────────────────┘
               │
               │ 14. Show Animation
               ▼
┌─────────────────────────────────────────┐
│  RevealAnimation Component              │
│  • Card flip animations                 │
│  • Show AI/Human icons                  │
│  • Show accuracy percentages            │
│  • Confetti celebration 🎉              │
└──────────────┬──────────────────────────┘
               │
               │ 15. Distribute Rewards
               ▼
┌─────────────────────────────────────────┐
│  Smart Contracts                        │
│  • Calculate reward distribution        │
│  • Transfer MNT to winners              │
│  • Update leaderboard                   │
└─────────────────────────────────────────┘
```

---

## 🗂️ File Structure

```
TuringArena/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Main page with voting integration
│   │   │   ├── layout.tsx            # Root layout
│   │   │   └── providers.tsx         # RainbowKit + wagmi providers
│   │   ├── components/
│   │   │   ├── VotingPanel.tsx       # ✅ NEW: Voting interface
│   │   │   ├── RevealAnimation.tsx   # ✅ NEW: Reveal animation
│   │   │   ├── AgentCard.tsx         # AI agent display
│   │   │   ├── LiveFeed.tsx          # Live trade feed
│   │   │   └── Leaderboard.tsx       # Top traders
│   │   ├── hooks/
│   │   │   ├── useVoting.ts          # ✅ NEW: Voting hooks
│   │   │   ├── useWebSocket.ts       # ✅ NEW: WebSocket hook
│   │   │   └── useAgents.ts          # Agent data hooks
│   │   └── lib/
│   │       ├── contracts.ts          # Contract ABIs & addresses
│   │       └── wagmi.ts              # wagmi configuration
│   └── .env.local                    # Environment variables
│
├── backend/
│   ├── src/
│   │   ├── index.js                  # Main server + WebSocket
│   │   ├── routes/
│   │   │   ├── rounds.js             # ✅ NEW: Round management
│   │   │   ├── agents.js             # Agent endpoints
│   │   │   ├── trading.js            # Trading endpoints
│   │   │   └── leaderboard.js        # Leaderboard endpoints
│   │   ├── agents/
│   │   │   ├── BaseAgent.js          # Base AI agent class
│   │   │   └── AgentFactory.js       # Agent instances
│   │   ├── services/
│   │   │   └── MarketDataService.js  # Market data fetching
│   │   └── config/
│   │       └── contracts.js          # Contract configuration
│   └── .env                          # Environment variables
│
├── contracts/
│   ├── contracts/
│   │   ├── AgentRegistry.sol         # ERC-721 for AI agents
│   │   ├── VotingPool.sol            # Voting & rewards
│   │   └── TuringArena.sol           # Game coordinator
│   ├── scripts/
│   │   └── deploy.js                 # Deployment script
│   ├── deployed-addresses.json       # Contract addresses
│   └── hardhat.config.js             # Hardhat configuration
│
└── docs/
    ├── VOTING_FLOW_COMPLETE.md       # Complete implementation guide
    ├── QUICK_TEST_GUIDE.md           # Quick testing guide
    ├── ГОТОВО_К_ТЕСТИРОВАНИЮ.md      # Russian guide
    └── ARCHITECTURE.md               # This file
```

---

## 🔌 API Endpoints

### Backend API (http://localhost:4000)

#### Rounds
- `POST /api/rounds/start` - Start new trading round
  - Body: `{ duration: 60 }`
  - Returns: Round ID, trades, timestamps

- `GET /api/rounds/:roundId` - Get round details
  - Returns: Round info, trades, status

- `GET /api/rounds/active/current` - Get active round
  - Returns: Current round or null

- `POST /api/rounds/:roundId/reveal` - Reveal results
  - Returns: Results with accuracy

#### Agents
- `GET /api/agents` - List all AI agents
  - Returns: Array of agents with stats

#### Trading
- `POST /api/trading/execute` - Execute AI trades
  - Returns: Trades from all agents

- `GET /api/trading/market` - Get market data
  - Returns: Gas price, MNT price, volume

#### Leaderboard
- `GET /api/leaderboard` - Get top traders
  - Returns: Sorted list of traders

---

## 🔗 WebSocket Events

### Client → Server
- Connection established
- Heartbeat/ping

### Server → Client
- `ROUND_START` - New round begins
  ```json
  {
    "type": "ROUND_START",
    "roundId": 1777737840450,
    "duration": 60,
    "startTime": 1777737840,
    "endTime": 1777737900,
    "agents": [...]
  }
  ```

- `TRADE` - New trade executed
  ```json
  {
    "type": "TRADE",
    "roundId": 1777737840450,
    "trade": {
      "traderId": 0,
      "traderName": "Aggressor",
      "action": "BUY",
      "amount": 800,
      "reasoning": "..."
    }
  }
  ```

- `ROUND_END` - Round timer expires
  ```json
  {
    "type": "ROUND_END",
    "roundId": 1777737840450,
    "trades": [...]
  }
  ```

- `ROUND_REVEAL` - Results revealed
  ```json
  {
    "type": "ROUND_REVEAL",
    "roundId": 1777737840450,
    "results": [
      {
        "traderId": 0,
        "traderName": "Aggressor",
        "isAI": true,
        "accuracy": 85.5
      }
    ]
  }
  ```

---

## 🎨 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Web3:** wagmi + viem
- **Wallet:** RainbowKit
- **State:** React Hooks

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **WebSocket:** ws
- **Web3:** ethers.js
- **AI:** Groq API (llama-3.3-70b-versatile)

### Blockchain
- **Network:** Mantle Sepolia Testnet
- **Language:** Solidity 0.8.25
- **Framework:** Hardhat
- **EVM:** Cancun

---

## 🔐 Security Considerations

### Frontend
- ✅ User wallet signatures required
- ✅ Transaction confirmation before submission
- ✅ Input validation on stake amounts
- ✅ HTTPS in production

### Backend
- ✅ CORS enabled for frontend origin
- ✅ Rate limiting (recommended for production)
- ✅ Input sanitization
- ✅ Private key in environment variables

### Smart Contracts
- ✅ Access control (onlyOwner)
- ✅ Reentrancy guards
- ✅ Integer overflow protection (Solidity 0.8+)
- ✅ Pausable functionality

---

## 📊 Data Flow

### Round Creation
```
User → Frontend → Backend → AI Agents → WebSocket → Frontend
```

### Voting
```
User → Frontend → RainbowKit → MetaMask → Blockchain → Contract
```

### Reveal
```
Backend → Calculate Results → WebSocket → Frontend → Animation
```

---

## 🚀 Deployment Architecture

### Production Setup
```
┌─────────────────┐
│   Vercel        │  Frontend (Next.js)
│   (Frontend)    │  • Static + SSR
└────────┬────────┘  • Edge Functions
         │
         │ HTTPS
         ▼
┌─────────────────┐
│   Railway       │  Backend (Node.js)
│   (Backend)     │  • REST API
└────────┬────────┘  • WebSocket Server
         │
         │ Web3
         ▼
┌─────────────────┐
│ Mantle Network  │  Smart Contracts
│  (Blockchain)   │  • Mainnet or Testnet
└─────────────────┘
```

---

## ✅ Implementation Status

### ✅ Completed
- [x] Smart contracts deployed
- [x] Backend API with all endpoints
- [x] AI agents with Groq integration
- [x] Frontend UI with all components
- [x] WebSocket real-time updates
- [x] Voting panel with wallet integration
- [x] Reveal animation
- [x] Contract integration (wagmi)

### 🔄 Ready to Test
- [ ] Complete voting flow in browser
- [ ] On-chain vote submission
- [ ] Reward distribution
- [ ] Production deployment

---

**Architecture Complete! Ready for Testing! 🚀**
