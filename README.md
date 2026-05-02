# TuringArena

**Human vs AI Trading Challenge on Mantle Network**

Can you tell AI from human by their trading decisions? Prove it and earn rewards.

Built for Turing Test Hackathon 2026 by Mantle Network.

---

## 🎯 Overview

TuringArena is a gamified DApp where users vote on whether traders are AI or human based on their trading behavior. Correct guesses earn rewards from the prize pool.

### Key Features
- 🤖 **AI Agents:** 3 AI traders with distinct personalities (Groq API)
- 🗳️ **On-Chain Voting:** Vote with MNT stakes on Mantle Network
- 💰 **Reward Pool:** Winners split the prize pool
- ⚡ **Real-Time:** WebSocket updates for live trading feed
- 🎨 **Cyberpunk UI:** Beautiful animations with Framer Motion

---

## 🏗️ Architecture

### Tech Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, RainbowKit
- **Backend:** Node.js, Express, WebSocket, Groq AI API
- **Blockchain:** Solidity 0.8.25, Hardhat, Mantle Sepolia Testnet
- **AI:** Groq API with llama-3.3-70b-versatile model

### Smart Contracts
- **AgentRegistry:** ERC-721 for AI agent NFTs
- **VotingPool:** Handles voting and reward distribution
- **TuringArena:** Main game logic coordinator

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask wallet
- Mantle Sepolia testnet MNT

### Installation

```bash
# Clone repository
git clone <repo-url>
cd TuringArena

# Install dependencies
npm install

# Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Edit .env files with your keys
```

### Run Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open http://localhost:3000

---

## 📋 Environment Variables

### Backend (.env)
```env
PRIVATE_KEY=your_wallet_private_key
GROQ_API_KEY=your_groq_api_key
PORT=4000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_VOTING_POOL_ADDRESS=0x444A930d5fdc9c33faeC0D5Dfb84cF1Dc0A05B1D
NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=0x2442EB032404c81e2B869B375FeF904C8DBF0634
NEXT_PUBLIC_TURING_ARENA_ADDRESS=0x4320C22491fAC70BfAfFa869eaDC5CD86174A3B1
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

---

## 🎮 How to Play

1. **Connect Wallet:** Connect MetaMask to Mantle Sepolia
2. **Start Round:** Click "Start New Round" button
3. **Watch Trades:** AI agents make trading decisions
4. **Vote:** Guess which traders are AI (🤖) or Human (👤)
5. **Stake:** Enter MNT amount (minimum 0.01 MNT)
6. **Submit:** Confirm transaction in MetaMask
7. **Reveal:** Wait for round end to see results
8. **Claim:** Winners claim their share of the prize pool

---

## 🤖 AI Agents

### Aggressor (80% Risk)
- Strategy: Momentum Trading
- Behavior: Catches pumps, high leverage, fast decisions
- Personality: Aggressive, confident

### Conservative (20% Risk)
- Strategy: Dollar-Cost Averaging
- Behavior: Patient, explains every move
- Personality: Cautious, analytical

### MemeLord (90% Risk)
- Strategy: Sentiment-Driven
- Behavior: Trades on hype, uses slang
- Personality: Unpredictable, meme-focused

---

## 📊 Contract Addresses (Mantle Sepolia)

```
AgentRegistry: 0x2442EB032404c81e2B869B375FeF904C8DBF0634
VotingPool:    0x444A930d5fdc9c33faeC0D5Dfb84cF1Dc0A05B1D
TuringArena:   0x4320C22491fAC70BfAfFa869eaDC5CD86174A3B1
```

Explorer: https://sepolia.mantlescan.xyz

---

## 🧪 Testing

See [TESTING.md](./TESTING.md) for detailed testing guide.

Quick test:
```bash
# Start services
cd backend && npm run dev &
cd frontend && npm run dev

# Open browser
open http://localhost:3000

# Connect wallet and start round
```

---

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [Architecture](./ARCHITECTURE.md) - System design and architecture
- [Testing Guide](./TESTING.md) - How to test the application
- [Quick Test](./QUICK_TEST_GUIDE.md) - Quick testing checklist
- [New Deployment](./NEW_DEPLOYMENT_READY.md) - Latest deployment info

---

## 🏆 Hackathon Submission

**Turing Test Hackathon 2026 by Mantle Network**

- **Track:** Consumer & Viral DApps
- **Prize Pool:** $100,000
- **Deadline:** June 15, 2026
- **Network:** Mantle (Testnet for testing, Mainnet for submission)

### Requirements Met
✅ Deployed on Mantle Network  
✅ Real blockchain interactions (no mocks)  
✅ Consumer-focused gamification  
✅ Viral potential (social voting game)  
✅ AI integration (Groq API)  

---

## 🛠️ Development

### Project Structure
```
TuringArena/
├── backend/          # Node.js backend + AI agents
├── contracts/        # Solidity smart contracts
├── frontend/         # Next.js frontend
└── docs/            # Documentation
```

### Key Technologies
- **Blockchain:** Mantle Network (Ethereum L2)
- **Smart Contracts:** Solidity, Hardhat, OpenZeppelin
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Wallet:** RainbowKit, wagmi, viem
- **AI:** Groq API (llama-3.3-70b-versatile)
- **Real-time:** WebSocket
- **Animations:** Framer Motion

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🤝 Contributing

This is a hackathon project. Contributions welcome after hackathon submission.

---

## 📞 Support

- GitHub Issues: [Create an issue]
- Documentation: See `/docs` folder
- Testing: See `TESTING.md`

---

**Built with ❤️ for Turing Test Hackathon 2026**
