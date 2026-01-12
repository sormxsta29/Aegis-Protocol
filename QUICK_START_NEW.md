# ⚡ QUICK START GUIDE

## Get Up and Running in 10 Minutes

### Step 1: Prerequisites (2 minutes)

Download and install:
1. **Node.js v20**: https://nodejs.org (NOT v24)
2. **PostgreSQL**: https://www.postgresql.org/download/
3. **Redis**: https://redis.io/download or WSL
4. **MetaMask**: https://metamask.io

### Step 2: Install Dependencies (3 minutes)

```powershell
# Root (smart contracts)
npm install --legacy-peer-deps

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install --legacy-peer-deps
```

### Step 3: Setup Database (1 minute)

```powershell
# Create database
createdb aegis

# Import schema
cd backend
psql -d aegis -f db/schema.sql

# Start Redis
redis-server
```

### Step 4: Configure (1 minute)

```powershell
# Backend
cd backend
cp .env.example .env
# Edit .env: Set DB password, etc.

# Frontend
cd ../frontend
cp .env.example .env
# Add your Alchemy key and WalletConnect project ID
```

Get free API keys:
- **Alchemy**: https://dashboard.alchemy.com
- **WalletConnect**: https://cloud.walletconnect.com

### Step 5: Start Everything (3 minutes)

```powershell
# Terminal 1: Local Blockchain
npx hardhat node

# Terminal 2: Deploy Contracts
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Backend Server
cd backend
npm start

# Terminal 4: Frontend
cd frontend
npm start
```

### Step 6: Use the App!

1. Open **http://localhost:3000**
2. Click **"Connect Wallet"**
3. Select **MetaMask**
4. Switch to **Localhost network** in MetaMask
5. Explore the dashboards!

## 🎮 Test Features

### Test Victim Dashboard
1. Click "Victim Portal"
2. View your token balances
3. Generate QR code for payments

### Test Merchant Dashboard
1. Click "Merchant Portal"
2. Register your business
3. Select category
4. Redeem tokens for USDC

### Test Admin Dashboard
1. Click "Admin Portal"
2. View system statistics
3. Monitor disasters
4. Manage distributions

### Test Analytics
1. Click "📊 Analytics"
2. View real-time charts
3. See live activity feed
4. Check platform metrics

## 🚀 Deploy to Testnet (Optional)

### Sepolia Testnet

1. **Get Testnet ETH**:
   - Visit: https://sepoliafaucet.com
   - Enter your address
   - Wait for tokens

2. **Deploy Contracts**:
   ```powershell
   npx hardhat run scripts/deploy.js --network sepolia
   ```

3. **Update Frontend Config**:
   - Copy deployed addresses to `frontend/.env`
   - Update `REACT_APP_*_ADDRESS` variables

4. **Switch MetaMask**:
   - Change network to "Sepolia"
   - Refresh frontend

## 📱 Mobile Access

1. Install MetaMask mobile app
2. Enable WalletConnect
3. Scan QR code from desktop
4. Use on mobile!

## 🐛 Common Issues

### "Cannot find module"
```powershell
npm install --legacy-peer-deps
```

### "Database connection failed"
```powershell
# Check PostgreSQL is running
# Verify credentials in backend/.env
```

### "Redis connection error"
```powershell
# Start Redis server
redis-server
```

### "MetaMask not connecting"
```powershell
# Make sure you're on the right network
# Check contract addresses in .env
```

### "Hardhat node won't start"
```powershell
# Use Node.js v20 or v18 (NOT v24)
# Downgrade: nvm install 20
#            nvm use 20
```

## 📚 Learn More

- **Full Documentation**: See README.md
- **API Reference**: See API.md
- **Deployment Guide**: See DEPLOYMENT.md
- **Architecture**: See ARCHITECTURE.md
- **What's New**: See WHATS_NEW.md
- **Complete Features**: See COMPLETE_FEATURES.md

## 🎯 Next Steps

1. **Customize**: Modify smart contracts for your needs
2. **Test**: Write comprehensive tests
3. **Audit**: Get contracts audited before mainnet
4. **Deploy**: Launch on production networks
5. **Monitor**: Set up logging and monitoring

## 💡 Tips

- Use **Sepolia** for testing (most supported testnet)
- Get free testnet tokens from faucets
- Check transaction status on Etherscan
- Join Discord/Telegram for support
- Read documentation thoroughly
- Test on testnet before mainnet

## ⚠️ Important Notes

- **Never deploy to mainnet without audit**
- **Keep private keys secure**
- **Test everything on testnet first**
- **Backup your database regularly**
- **Monitor gas prices**

## 🎉 Success!

If you see the Aegis app running with:
- ✅ Wallet connected
- ✅ Backend server running
- ✅ Real-time notifications working
- ✅ Charts displaying data

**You're all set!** 🚀

---

**Need Help?**
1. Check the error message
2. Read relevant documentation
3. Verify configuration
4. Check GitHub issues
5. Ask in community

**Happy Building!** 🛡️
