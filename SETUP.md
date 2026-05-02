# 🚀 TuringArena Setup Guide

Complete setup instructions for running TuringArena locally.

---

## ✅ Current Status

- ✅ **Smart Contracts** — Compiled and ready to deploy
- ✅ **Frontend** — Running on `http://localhost:3000`
- ✅ **Backend** — Running on `http://localhost:4000`

---

## 📋 Prerequisites

1. **Node.js** 18+ installed
2. **Metamask** with Mantle Testnet configured
3. **Groq API Key** (free from https://console.groq.com)
4. **WalletConnect Project ID** (free from https://cloud.walletconnect.com)
5. **Mantle Testnet MNT** (from faucet)

---

## 🔧 Setup Steps

### 1. Install Dependencies

```bash
# Root
npm install

# Contracts
cd contracts
npm install

# Frontend
cd ../frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure Environment Variables

#### **Contracts** (`contracts/.env`)
```env
MANTLE_TESTNET_RPC=https://rpc.testnet.mantle.xyz
PRIVATE_KEY=your_private_key_here
```

#### **Frontend** (`frontend/.env.local`)
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=0x... # After deployment
NEXT_PUBLIC_VOTING_POOL_ADDRESS=0x...    # After deployment
NEXT_PUBLIC_TURING_ARENA_ADDRESS=0x...   # After deployment
```

#### **Backend** (`backend/.env`)
```env
GROQ_API_KEY=your_groq_api_key_here
PRIVATE_KEY=your_private_key_here
AGENT_REGISTRY_ADDRESS=0x...  # After deployment
VOTING_POOL_ADDRESS=0x...     # After deployment
TURING_ARENA_ADDRESS=0x...    # After deployment
```

### 3. Deploy Smart Contracts

```bash
cd contracts
npm run deploy:testnet
```

This will:
- Deploy 3 contracts to Mantle Testnet
- Register 3 AI agents
- Save addresses to `deployed-addresses.json`

**Copy the addresses** to frontend and backend `.env` files.

### 4. Verify Contracts (Optional)

```bash
npx hardhat verify --network mantleTestnet <CONTRACT_ADDRESS>
```

### 5. Start All Services

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

---

## 🎮 Usage

### Access the App
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

### API Endpoints

#### Get All Agents
```bash
GET http://localhost:4000/api/agents
```

#### Get Market Data
```bash
GET http://localhost:4000/api/trading/market
```

#### Execute Trades
```bash
POST http://localhost:4000/api/trading/execute
```

#### Get Leaderboard
```bash
GET http://localhost:4000/api/leaderboard
```

---

## 🤖 Testing AI Agents

### Manual Test
```bash
curl -X POST http://localhost:4000/api/trading/execute
```

This will:
1. Fetch current market data from Mantle
2. Each AI agent makes a decision using Groq LLM
3. Trades are executed and broadcast via WebSocket
4. Results returned in JSON

### Watch Live Feed
Open browser console on `http://localhost:3000` and watch WebSocket messages.

---

## 🔗 Get API Keys

### Groq API Key (Free)
1. Go to https://console.groq.com
2. Sign up / Log in
3. Create API key
4. Copy to `backend/.env`

### WalletConnect Project ID (Free)
1. Go to https://cloud.walletconnect.com
2. Create new project
3. Copy Project ID
4. Paste to `frontend/.env.local`

### Mantle Testnet Faucet
1. Go to https://faucet.testnet.mantle.xyz
2. Connect wallet
3. Request testnet MNT

---

## 📝 Next Steps

1. **Deploy Contracts** to Mantle Testnet
2. **Update `.env` files** with contract addresses
3. **Test AI agents** with real Groq API key
4. **Connect wallet** on frontend
5. **Start voting round** and test full flow

---

## 🐛 Troubleshooting

### Backend won't start
- Check `PRIVATE_KEY` is valid (not all zeros)
- Check `GROQ_API_KEY` is set

### Frontend wallet connection fails
- Check `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
- Check Metamask is on Mantle Testnet

### Contracts deployment fails
- Check you have testnet MNT
- Check `PRIVATE_KEY` has funds
- Check RPC URL is correct

---

## 📚 Documentation

- **Mantle Docs**: https://docs.mantle.xyz
- **Groq Docs**: https://console.groq.com/docs
- **RainbowKit**: https://rainbowkit.com
- **Hardhat**: https://hardhat.org

---

## 🏆 For Hackathon Submission

1. Deploy to Mantle **Mainnet** (not Testnet)
2. Verify all contracts on Mantle Explorer
3. Deploy frontend to **Vercel**
4. Deploy backend to **Railway**
5. Record **demo video** (≥2 min)
6. Update **README.md** with live links
7. Submit to **DoraHacks**

---

**Built for Turing Test Hackathon 2026 🚀**
