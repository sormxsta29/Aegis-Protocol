# DEPLOYMENT GUIDE

## Prerequisites

1. **Node.js**: Version 18.x or 20.x (NOT v24+)
2. **PostgreSQL**: Version 14+ for backend database
3. **Redis**: For caching and real-time features
4. **MetaMask**: Browser wallet extension
5. **API Keys**:
   - Alchemy or Infura (for blockchain RPC)
   - WalletConnect Project ID
   - Chainlink API key (optional for oracles)

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
```

### Smart Contracts
```bash
npm install --legacy-peer-deps
```

## Step 2: Setup PostgreSQL Database

```bash
# Create database
createdb aegis

# Run schema
psql -d aegis -f backend/db/schema.sql
```

## Step 3: Setup Redis

```bash
# Install Redis (Windows)
# Download from https://github.com/microsoftarchive/redis/releases
# Or use WSL

# Start Redis server
redis-server
```

## Step 4: Configure Environment Variables

### Backend (.env)
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

### Frontend (.env)
```bash
cd frontend
cp .env.example .env
# Edit .env with your configuration
```

### Hardhat (.env)
```bash
# Create .env in root directory
PRIVATE_KEY=your_wallet_private_key
ALCHEMY_API_KEY=your_alchemy_key
ETHERSCAN_API_KEY=your_etherscan_key
```

## Step 5: Deploy Smart Contracts

### Local Deployment (Testing)
```bash
# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

### Testnet Deployment (Sepolia)
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Production Deployment (Mainnet)
```bash
# ⚠️ MAKE SURE YOU'VE AUDITED CONTRACTS FIRST
npx hardhat run scripts/deploy.js --network mainnet
```

## Step 6: Update Contract Addresses

After deployment, update these files with deployed addresses:

1. **backend/.env**
   - AEGIS_TOKEN_ADDRESS
   - CATEGORY_MANAGER_ADDRESS
   - AEGIS_VAULT_ADDRESS
   - etc.

2. **frontend/.env**
   - REACT_APP_AEGIS_TOKEN_ADDRESS
   - REACT_APP_CATEGORY_MANAGER_ADDRESS
   - etc.

## Step 7: Export Contract ABIs

```bash
# Copy ABIs to frontend
mkdir -p frontend/src/abi
cp artifacts/contracts/AegisToken.sol/AegisToken.json frontend/src/abi/
cp artifacts/contracts/CategoryManager.sol/CategoryManager.json frontend/src/abi/
cp artifacts/contracts/AegisVault.sol/AegisVault.json frontend/src/abi/
cp artifacts/contracts/DisasterOracle.sol/DisasterOracle.json frontend/src/abi/
cp artifacts/contracts/AegisGovernance.sol/AegisGovernance.json frontend/src/abi/
cp artifacts/contracts/AegisStaking.sol/AegisStaking.json frontend/src/abi/
cp artifacts/contracts/AegisBadges.sol/AegisBadges.json frontend/src/abi/
cp artifacts/contracts/DonationTracker.sol/DonationTracker.json frontend/src/abi/
cp artifacts/contracts/SupplyChain.sol/SupplyChain.json frontend/src/abi/
```

## Step 8: Start Backend Server

```bash
cd backend
npm start

# For development with auto-reload
npm run dev
```

Backend will run on http://localhost:5000

## Step 9: Start Frontend

```bash
cd frontend
npm start
```

Frontend will run on http://localhost:3000

## Step 10: Verify Deployment

1. Open http://localhost:3000
2. Connect MetaMask wallet
3. Switch to the network where contracts are deployed
4. Test basic functionality:
   - Connect wallet
   - View balances
   - Make a test transaction
   - Check real-time updates

## Network Configuration

### Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
- **Block Explorer**: https://sepolia.etherscan.io
- **Faucet**: https://sepoliafaucet.com

### Polygon Mumbai Testnet  
- **Chain ID**: 80001
- **RPC URL**: https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY
- **Block Explorer**: https://mumbai.polygonscan.com
- **Faucet**: https://faucet.polygon.technology

### Arbitrum Goerli Testnet
- **Chain ID**: 421613
- **RPC URL**: https://goerli-rollup.arbitrum.io/rpc
- **Block Explorer**: https://goerli.arbiscan.io
- **Faucet**: https://goerlifaucet.com

## Production Checklist

- [ ] Smart contracts audited by professional security firm
- [ ] All environment variables properly set
- [ ] Database backup strategy in place
- [ ] Redis configured with persistence
- [ ] SSL certificates installed
- [ ] Rate limiting configured
- [ ] Monitoring and logging set up
- [ ] Error tracking (e.g., Sentry) integrated
- [ ] Load balancer configured
- [ ] CDN set up for frontend
- [ ] Domain names configured
- [ ] Firewall rules configured
- [ ] Regular security updates scheduled

## Troubleshooting

### Issue: Hardhat won't start
**Solution**: Downgrade Node.js to v20 or v18

### Issue: Frontend won't connect to contracts
**Solution**: 
1. Check contract addresses in .env
2. Verify network in MetaMask matches deployed network
3. Check ABIs are exported correctly

### Issue: Backend can't connect to database
**Solution**:
1. Verify PostgreSQL is running
2. Check database credentials in .env
3. Ensure database schema is created

### Issue: WebSocket not connecting
**Solution**:
1. Check Redis is running
2. Verify CORS settings in backend
3. Check firewall isn't blocking WebSocket port

## Support

For issues, please check:
- README.md
- API.md
- ARCHITECTURE.md
- GitHub Issues (if applicable)
