# 🧪 Testing Guide

## Quick Start

### 1. Start Services
```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

### 2. Open Application
```
http://localhost:3000
```

### 3. Connect Wallet
1. Click "Connect Wallet"
2. Select MetaMask
3. Approve connection
4. Switch to Mantle Sepolia Testnet (Chain ID: 5003)

### 4. Test Voting Flow
1. Click "Start New Round"
2. Wait for VotingPanel to appear
3. Vote on traders (🤖 AI or 👤 Human)
4. Enter stake amount (minimum 0.01 MNT)
5. Click "Submit Votes"
6. Confirm transaction in MetaMask
7. Wait for success notification

## Network Setup

### Mantle Sepolia Testnet
- **Chain ID:** 5003
- **RPC URL:** https://rpc.sepolia.mantle.xyz
- **Currency:** MNT
- **Explorer:** https://sepolia.mantlescan.xyz

### Get Testnet MNT
1. Get Sepolia ETH: https://sepoliafaucet.com
2. Bridge to Mantle: https://bridge.sepolia.mantle.xyz
3. Wait 5-10 minutes

## Contract Addresses

```
AgentRegistry: 0x2442EB032404c81e2B869B375FeF904C8DBF0634
VotingPool:    0x444A930d5fdc9c33faeC0D5Dfb84cF1Dc0A05B1D
TuringArena:   0x4320C22491fAC70BfAfFa869eaDC5CD86174A3B1
```

## Troubleshooting

### WebSocket Errors on Page Load
- **Not critical** - WebSocket reconnects automatically
- Check "Live" indicator in header (green = connected)

### Transaction Failed
1. Check you're on Mantle Sepolia network
2. Verify you have enough MNT for gas
3. Check transaction on explorer
4. Look at browser console for errors

### Backend Not Starting
1. Check `.env` file exists with required variables
2. Verify `PRIVATE_KEY` and `GROQ_API_KEY` are set
3. Check port 4000 is not in use

### Frontend Not Loading
1. Check `.env.local` has contract addresses
2. Verify backend is running
3. Clear browser cache and reload

## Expected Behavior

### Successful Round Start
- Backend logs: "Transaction confirmed!"
- Frontend shows: Blue toast "Starting new round..."
- Then: Green toast "Round #X started!"
- VotingPanel appears with trades

### Successful Vote
- MetaMask opens for confirmation
- Transaction sent to blockchain
- Green toast: "Vote submitted successfully!"
- Transaction visible on explorer with "Success" status

## Performance

- Round creation: ~5-10 seconds
- Vote transaction: ~5-10 seconds
- WebSocket updates: Real-time (<1 second)

## Known Issues

- WebSocket connection warnings on page load (not critical)
- MetaMask async-storage warnings (not critical)
- First transaction may take longer due to network sync
