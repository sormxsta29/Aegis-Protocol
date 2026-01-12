# 🚀 Quick Start Guide

## Prerequisites Installed ✅
- Node.js and npm
- Dependencies installed

## Step 1: Configure Environment (Optional)

Copy the example environment file:
```powershell
Copy-Item .env.example .env
```

Edit `.env` and add your keys (optional for local development):
- Get Alchemy API key from: https://www.alchemy.com/
- Get Etherscan API key from: https://etherscan.io/apis

## Step 2: Run Local Blockchain

Open a **NEW PowerShell terminal** and run:
```powershell
npx hardhat node
```

Keep this terminal running! It will show:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

## Step 3: Deploy Smart Contracts

Open a **SECOND PowerShell terminal** and run:
```powershell
npx hardhat run scripts/deploy.js --network localhost
```

You'll see contract addresses printed. Keep this terminal open.

## Step 4: Start Frontend

Open a **THIRD PowerShell terminal** and run:
```powershell
cd frontend
npm start
```

The app will open at: **http://localhost:3000**

---

## 🌐 Network Support Added

### Ethereum Networks
- **Mainnet** (Chain ID: 1)
- **Sepolia Testnet** (Chain ID: 11155111)
- **Goerli Testnet** (Chain ID: 5)

### Polygon Networks
- **Polygon Mainnet** (Chain ID: 137)
- **Mumbai Testnet** (Chain ID: 80001)

---

## Deploy to Ethereum Sepolia (Testnet)

1. Get Sepolia ETH from faucet: https://sepoliafaucet.com/

2. Add to `.env`:
```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-ALCHEMY-KEY
PRIVATE_KEY=your_wallet_private_key
```

3. Deploy:
```powershell
npx hardhat run scripts/deploy.js --network sepolia
```

---

## Deploy to Ethereum Mainnet

⚠️ **WARNING: Real money! Test thoroughly first!**

```powershell
npx hardhat run scripts/deploy.js --network mainnet
```

---

## Using the Application

### 1. Victim Portal
- View relief tokens
- Generate offline QR codes
- Make purchases

### 2. Merchant Portal
- Register business
- Accept relief tokens
- Redeem for USDC instantly

### 3. Admin Portal
- Monitor disasters
- Configure thresholds
- Verify merchants
- Release emergency funds

---

## Troubleshooting

**Issue: "Cannot find module"**
```powershell
npm install --legacy-peer-deps
```

**Issue: Port 3000 already in use**
```powershell
# Kill process on port 3000 (if needed)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Issue: Hardhat node not responding**
- Restart the hardhat node terminal
- Redeploy contracts

---

## Next Steps

1. ✅ Local development working
2. 🔄 Test on Sepolia testnet
3. 🔄 Get security audit
4. 🔄 Deploy to mainnet

**Enjoy building disaster relief on blockchain! 🛡️**
