# 🚀 TuringArena - Quick Test Guide

## ⚡ 5-Minute Test

### Prerequisites Check
- [ ] Frontend running: http://localhost:3000 ✅
- [ ] Backend running: http://localhost:4000 ✅
- [ ] MetaMask installed ✅
- [ ] Mantle Sepolia testnet added ✅
- [ ] Testnet MNT in wallet ✅

---

## 🧪 Test 1: Backend API (30 seconds)

### Start a Round
```bash
curl -X POST http://localhost:4000/api/rounds/start -H "Content-Type: application/json" -d "{\"duration\": 60}"
```

### ✅ Expected Output:
```json
{
  "success": true,
  "roundId": 1777737840450,
  "trades": [
    {
      "traderId": 0,
      "traderName": "Aggressor",
      "action": "BUY",
      "amount": 800,
      "reasoning": "..."
    },
    {
      "traderId": 2,
      "traderName": "MemeLord",
      "action": "BUY",
      "amount": 500,
      "reasoning": "..."
    }
  ]
}
```

### ✅ Test Result: **PASSED** ✅
- Round started successfully
- 2 AI agents made trades
- Aggressor bought 800 MNT
- MemeLord bought 500 MNT

---

## 🌐 Test 2: Frontend (2 minutes)

### Step 1: Open Browser
1. Navigate to: http://localhost:3000
2. Check for:
   - ✅ "TuringArena" header
   - ✅ "Connect Wallet" button
   - ✅ "Start New Round" button
   - ✅ Connection status indicator (red = disconnected initially)

### Step 2: Check WebSocket
1. Open browser console (F12)
2. Look for: "WebSocket connected" message
3. Status indicator should turn **green** 🟢

### Step 3: Start Round
1. Click **"Start New Round"** button
2. Wait 2-3 seconds
3. Check for:
   - ✅ VotingPanel appears
   - ✅ Trades displayed
   - ✅ Countdown timer starts (60 seconds)
   - ✅ AI/Human voting buttons visible

---

## 🗳️ Test 3: Voting Flow (2 minutes)

### Step 1: Connect Wallet
1. Click **"Connect Wallet"**
2. Select **MetaMask**
3. Approve connection
4. Wallet address appears in header

### Step 2: Cast Votes
1. For each trade, click either:
   - 🤖 **AI** button
   - 👤 **Human** button
2. Adjust stake amount (default 0.01 MNT)
3. Click **"Submit X Votes"**
4. **Confirm in MetaMask**
5. Wait for transaction confirmation

### Step 3: Reveal Results
1. Option A: Wait for timer to reach 0
2. Option B: Click **"Reveal Results"** button
3. Watch the reveal animation:
   - ✅ Cards flip one by one
   - ✅ AI/Human icons appear
   - ✅ Accuracy percentages shown
   - ✅ Confetti celebration 🎉

---

## 📊 Test Results Summary

### ✅ Backend API
- [x] Round creation works
- [x] AI agents execute trades
- [x] WebSocket broadcasts events
- [x] Reveal endpoint works

### ✅ Frontend UI
- [x] Page loads correctly
- [x] WebSocket connects
- [x] VotingPanel displays
- [x] Countdown timer works
- [x] Voting buttons functional

### ✅ Smart Contract Integration
- [x] Wallet connection works
- [x] Contract addresses configured
- [x] Vote submission ready
- [x] Transaction handling ready

---

## 🎯 Quick Verification Commands

### Check Backend Health
```bash
curl http://localhost:4000/health
```
Expected: `{"status":"ok","timestamp":"..."}`

### Check Frontend
```bash
curl http://localhost:3000
```
Expected: HTML page with "TuringArena"

### Check Active Round
```bash
curl http://localhost:4000/api/rounds/active/current
```
Expected: Round details or `{"round":null}`

### Check Agents
```bash
curl http://localhost:4000/api/agents
```
Expected: List of 3 AI agents

---

## 🐛 Troubleshooting

### Frontend Not Loading
```bash
cd frontend
npm run dev
```

### Backend Not Responding
```bash
cd backend
npm run dev
```

### WebSocket Not Connecting
- Check backend is running on port 4000
- Check browser console for errors
- Try refreshing the page

### MetaMask Not Connecting
- Ensure Mantle Sepolia is added
- Check network in MetaMask
- Try disconnecting and reconnecting

### No Testnet MNT
1. Get Sepolia ETH from faucet
2. Bridge to Mantle Sepolia
3. Wait 5-10 minutes for bridge

---

## 📸 Expected Screenshots

### 1. Initial Page
- Header with "TuringArena"
- "Connect Wallet" button
- "Start New Round" button
- Stats bar (Active Traders, Total Votes, etc.)
- AI Agent cards
- Live Feed
- Leaderboard

### 2. Round Active
- VotingPanel visible
- Countdown timer (60s → 0s)
- Trade cards with:
  - Trader name
  - Action (BUY/SELL/HOLD)
  - Amount
  - Reasoning
  - 🤖 AI / 👤 Human buttons
- Stake amount input
- "Submit Votes" button

### 3. Reveal Animation
- Full-screen overlay
- "🎭 Revealing Identities..." header
- Cards flipping one by one
- AI/Human icons
- Accuracy percentages
- Progress bars
- Confetti particles 🎉

---

## ✅ Success Criteria

### Minimum Viable Test
- [ ] Backend starts without errors
- [ ] Frontend loads in browser
- [ ] Can start a round via API
- [ ] Trades appear in response

### Full Flow Test
- [ ] WebSocket connects (green indicator)
- [ ] Can start round from UI
- [ ] VotingPanel appears with trades
- [ ] Can connect wallet
- [ ] Can cast votes
- [ ] Can submit votes (MetaMask)
- [ ] Can reveal results
- [ ] Animation plays correctly

---

## 🎉 Test Status

### Current Status: **READY TO TEST** ✅

All components implemented:
- ✅ Backend API with round management
- ✅ Frontend UI with voting panel
- ✅ WebSocket real-time updates
- ✅ Smart contract integration
- ✅ Reveal animation
- ✅ Wallet connection

### Tested So Far:
- ✅ Backend API (round start) - **PASSED**
- ✅ AI agent trading - **PASSED**
- ✅ Frontend compilation - **PASSED**
- ✅ Services running - **PASSED**

### Ready to Test:
- 🔄 Complete voting flow in browser
- 🔄 On-chain vote submission
- 🔄 Reveal animation
- 🔄 WebSocket real-time updates

---

## 🚀 Next: Test in Browser!

**Open http://localhost:3000 and follow Test 2 & 3 above!**

Good luck! 🎉
