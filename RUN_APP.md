# Running AEGIS Application

## ✅ Installation Complete!

Ethereum network support has been added to your configuration.

## 🎯 Supported Networks

### Ethereum
- **Mainnet** (Chain ID: 1)
- **Sepolia Testnet** (Chain ID: 11155111) - Recommended for testing
- **Goerli Testnet** (Chain ID: 5)

### Polygon  
- **Polygon Mainnet** (Chain ID: 137)
- **Mumbai Testnet** (Chain ID: 80001)

## 🚀 Quick Start Options

### Option 1: Run Frontend Only (Demo Mode)

The frontend works standalone with simulated data:

```powershell
cd frontend
npm start
```

Visit: **http://localhost:3000**

You can explore all 3 dashboards:
- Victim Portal
- Merchant Portal  
- Admin Portal

---

### Option 2: Deploy to Public Testnet

#### A. Get Test ETH for Sepolia

1. Visit: https://sepoliafaucet.com/
2. Enter your MetaMask wallet address
3. Receive free Sepolia ETH

#### B. Setup Environment

Create `.env` file:
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY
PRIVATE_KEY=your_wallet_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

Get free API keys:
- Alchemy: https://www.alchemy.com/
- Etherscan: https://etherscan.io/apis

#### C. Deploy Contracts

```powershell
# Compile contracts
npx hardhat compile

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

#### D. Connect Frontend to Testnet

Update `frontend/src/config.js` with your deployed contract addresses.

---

### Option 3: Use Remix IDE (No Local Setup)

1. Copy smart contracts to Remix: https://remix.ethereum.org/
2. Compile and deploy from browser
3. Test contracts directly in Remix

---

## 📱 Using the Application

### Victim Dashboard
- ✅ View token balances (Food, Medical, Education, Shelter, Utilities)
- ✅ Generate offline QR codes
- ✅ Request emergency relief
- ✅ Privacy-protected identity

### Merchant Dashboard
- ✅ Register business with category
- ✅ Accept relief tokens
- ✅ Redeem for USDC instantly
- ✅ Track earnings in real-time

### Admin Dashboard
- ✅ Monitor disaster events
- ✅ Configure automatic triggers
- ✅ Verify merchants
- ✅ Manage regional responders

---

## 🔧 Troubleshooting

### Node.js Version Issue

If you see Node.js version warnings, you have 2 options:

**Option A: Use older Node.js version**
- Install Node.js v18.x from: https://nodejs.org/
- Restart your computer
- Try again

**Option B: Skip blockchain, run frontend only**
- Just run the frontend in demo mode (see Option 1 above)

### Port Already in Use

```powershell
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

---

## 📚 Key Features Implemented

1. ✅ **Purpose-Bound Tokens** - ERC-1155 with spending restrictions
2. ✅ **Offline Transactions** - Meta-transactions & QR codes
3. ✅ **Oracle Automation** - Chainlink disaster detection
4. ✅ **Instant Settlement** - Atomic USDC swaps
5. ✅ **Gasless Transactions** - ERC-4337 paymaster
6. ✅ **Zero-Knowledge** - Privacy-preserving identity

---

## 🌐 Network Configuration Added

Your `hardhat.config.js` now includes:
- Ethereum Mainnet
- Ethereum Sepolia (recommended testnet)
- Ethereum Goerli
- Polygon Mainnet
- Polygon Mumbai

---

## 🎉 Next Steps

1. **Run the frontend**: `cd frontend && npm start`
2. **Explore the UI**: Check out all 3 dashboards
3. **Test on testnet**: Deploy to Sepolia when ready
4. **Read docs**: Check `docs/TUTORIAL.md` for details

**Enjoy building! 🛡️**

---

## Need Help?

- Documentation: `docs/` folder
- Tutorial: `docs/TUTORIAL.md`
- API Reference: `docs/API.md`
- Architecture: `docs/ARCHITECTURE.md`
