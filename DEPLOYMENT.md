# 🚀 Deployment Guide

## Vercel Deployment (Frontend)

### Prerequisites
- Vercel account
- GitHub repository connected
- Environment variables ready

### Steps

1. **Import Project to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select `frontend` as the root directory

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Add Environment Variables**
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   NEXT_PUBLIC_VOTING_POOL_ADDRESS=0x444A930d5fdc9c33faeC0D5Dfb84cF1Dc0A05B1D
   NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=0x2442EB032404c81e2B869B375FeF904C8DBF0634
   NEXT_PUBLIC_TURING_ARENA_ADDRESS=0x4320C22491fAC70BfAfFa869eaDC5CD86174A3B1
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-project.vercel.app`

### Troubleshooting

#### Build Fails
- Check that root directory is set to `frontend`
- Verify all environment variables are set
- Check build logs for specific errors

#### WebSocket Errors
- Update `NEXT_PUBLIC_API_URL` to your backend URL
- Make sure backend is deployed and accessible

---

## Railway Deployment (Backend)

### Prerequisites
- Railway account
- GitHub repository connected

### Steps

1. **Create New Project**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Configure Service**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables**
   ```
   PRIVATE_KEY=your_wallet_private_key
   GROQ_API_KEY=your_groq_api_key
   PORT=4000
   MANTLE_TESTNET_RPC=https://rpc.sepolia.mantle.xyz
   ```

4. **Deploy**
   - Railway will automatically deploy
   - Get your backend URL from Railway dashboard
   - Update frontend `NEXT_PUBLIC_API_URL` with this URL

---

## Contract Deployment

### Mantle Sepolia Testnet (Testing)

```bash
cd contracts
npx hardhat run scripts/deploy.js --network mantleTestnet
```

### Mantle Mainnet (Production)

```bash
cd contracts
npx hardhat run scripts/deploy.js --network mantleMainnet
```

After deployment:
1. Update contract addresses in frontend `.env.local`
2. Update contract addresses in backend `.env`
3. Redeploy frontend and backend

---

## Environment Variables Summary

### Frontend (Vercel)
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_VOTING_POOL_ADDRESS=
NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=
NEXT_PUBLIC_TURING_ARENA_ADDRESS=
NEXT_PUBLIC_API_URL=
```

### Backend (Railway)
```env
PRIVATE_KEY=
GROQ_API_KEY=
PORT=4000
MANTLE_TESTNET_RPC=https://rpc.sepolia.mantle.xyz
```

### Contracts (Local)
```env
PRIVATE_KEY=
MANTLE_TESTNET_RPC=https://rpc.sepolia.mantle.xyz
MANTLE_MAINNET_RPC=https://rpc.mantle.xyz
```

---

## Post-Deployment Checklist

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Railway
- [ ] Contracts deployed on Mantle
- [ ] Environment variables configured
- [ ] WebSocket connection working
- [ ] Wallet connection working
- [ ] Voting flow tested
- [ ] AI agents responding
- [ ] Transactions confirming on blockchain

---

## Monitoring

### Frontend (Vercel)
- Check Vercel dashboard for build logs
- Monitor function logs for errors
- Check analytics for traffic

### Backend (Railway)
- Check Railway logs for errors
- Monitor WebSocket connections
- Check AI agent responses

### Contracts (Mantle)
- Monitor transactions on Mantlescan
- Check contract events
- Verify vote submissions

---

## Rollback

### Frontend
- Go to Vercel dashboard
- Select previous deployment
- Click "Promote to Production"

### Backend
- Go to Railway dashboard
- Select previous deployment
- Click "Redeploy"

### Contracts
- Deploy new version with fixes
- Update addresses in frontend/backend
- Redeploy services

---

## Support

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Mantle Docs: https://docs.mantle.xyz
