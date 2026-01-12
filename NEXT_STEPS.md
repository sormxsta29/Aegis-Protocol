# 🎯 NEXT STEPS TO RUN THE APPLICATION

## ✅ What's Already Complete

All code has been created:
- ✅ 13 Smart contracts
- ✅ Backend server with WebSocket
- ✅ React frontend with Web3 integration
- ✅ Database schema
- ✅ Configuration files
- ✅ Deployment scripts
- ✅ Complete documentation

## 📋 What You Need to Do

### 1. Install Required Software

Download and install these first:

```
✅ Node.js v20 (NOT v24)
   Download: https://nodejs.org/dist/v20.11.0/

✅ PostgreSQL 14+
   Download: https://www.postgresql.org/download/windows/

✅ Redis
   Option A: WSL + Linux Redis
   Option B: Memurai for Windows - https://www.memurai.com/

✅ MetaMask Browser Extension
   Install: https://metamask.io/download/
```

### 2. Get Free API Keys

Sign up for these free services:

```
✅ Alchemy (for blockchain RPC)
   1. Go to: https://dashboard.alchemy.com
   2. Sign up
   3. Create new app
   4. Copy API key

✅ WalletConnect (for wallet integration)
   1. Go to: https://cloud.walletconnect.com
   2. Sign up
   3. Create project
   4. Copy Project ID
```

### 3. Install Dependencies

Open PowerShell in project root and run:

```powershell
# Install root dependencies (Hardhat)
npm install --legacy-peer-deps

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install --legacy-peer-deps
cd ..
```

**Expected time**: 5-10 minutes

### 4. Setup Database

In PowerShell:

```powershell
# Create database
createdb aegis

# Import schema
cd backend
psql -d aegis -f db/schema.sql
cd ..

# Start Redis
redis-server
```

Keep Redis running in that terminal.

### 5. Configure Environment

#### Backend Configuration

```powershell
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
DB_PASSWORD=your_postgres_password
# Rest can stay as defaults for local dev
```

#### Frontend Configuration

```powershell
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```
REACT_APP_ALCHEMY_KEY=your_alchemy_key_here
REACT_APP_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### 6. Start Local Blockchain

Open a new PowerShell terminal:

```powershell
npx hardhat node
```

Keep this running - it's your local blockchain.

You'll see accounts with ETH printed. Copy one of the private keys.

### 7. Deploy Smart Contracts

Open another PowerShell terminal:

```powershell
npx hardhat run scripts/deploy.js --network localhost
```

This deploys all 13 contracts. It will print addresses like:
```
AegisToken deployed to: 0x...
CategoryManager deployed to: 0x...
...
```

**IMPORTANT**: Copy all these addresses!

### 8. Export Contract ABIs

```powershell
# Create ABI directory
mkdir frontend\src\abi

# Copy ABIs (you can also do this manually in File Explorer)
# Copy all .json files from artifacts/contracts/**/*.json to frontend/src/abi/
```

Or manually:
1. Go to `artifacts/contracts/` folder
2. Find each contract folder (like `AegisToken.sol/`)
3. Copy the `.json` file (like `AegisToken.json`)
4. Paste into `frontend/src/abi/`

### 9. Update Frontend with Contract Addresses

Edit `frontend/.env` and add the deployed addresses:

```
REACT_APP_AEGIS_TOKEN_ADDRESS=0x... (from step 7)
REACT_APP_CATEGORY_MANAGER_ADDRESS=0x...
REACT_APP_AEGIS_VAULT_ADDRESS=0x...
# ... etc for all contracts
```

### 10. Start Backend Server

Open a new PowerShell terminal:

```powershell
cd backend
npm start
```

You should see:
```
🚀 Server running on port 5000
📡 WebSocket server ready
```

### 11. Start Frontend

Open another PowerShell terminal:

```powershell
cd frontend
npm start
```

Browser should auto-open to http://localhost:3000

### 12. Connect MetaMask

In the browser:

1. Click MetaMask extension
2. Click network dropdown (top)
3. Click "Add Network" → "Add network manually"
4. Enter:
   - Network Name: Localhost
   - RPC URL: http://localhost:8545
   - Chain ID: 31337
   - Currency: ETH
5. Click "Save"

6. Import an account:
   - Click account icon → "Import Account"
   - Paste private key from step 6
   - This account has 10,000 ETH for testing

### 13. Use the App!

Now on http://localhost:3000:

1. Click "Connect Wallet"
2. Select MetaMask
3. Approve connection
4. You're connected! 🎉

Try different dashboards:
- **Victim Portal**: View token balances
- **Merchant Portal**: Register business
- **Admin Portal**: System statistics
- **📊 Analytics**: Real-time charts

## 🎬 Final Summary

You should have 5 terminals running:

1. **Terminal 1**: `npx hardhat node` (blockchain)
2. **Terminal 2**: `redis-server` (cache)
3. **Terminal 3**: `cd backend && npm start` (API server)
4. **Terminal 4**: `cd frontend && npm start` (React app)
5. **Terminal 5**: Free for commands

## ✅ Verify Everything Works

Check:
- [ ] http://localhost:3000 opens
- [ ] "Connect Wallet" button appears
- [ ] MetaMask connects successfully
- [ ] Backend shows in Terminal 3: "Server running"
- [ ] Real-time notifications appear (check console)
- [ ] Charts load in Analytics tab
- [ ] No error messages in browser console

## 🐛 If Something Goes Wrong

### Frontend won't start
```powershell
cd frontend
rm -r node_modules
npm install --legacy-peer-deps
npm start
```

### Backend won't start
```powershell
# Check PostgreSQL is running
# Check Redis is running
# Check .env has correct database password
```

### Contracts won't deploy
```powershell
# Make sure hardhat node is running in another terminal
# Check you're using Node.js v20, not v24
node --version
```

### MetaMask won't connect
```powershell
# Make sure you added Localhost network
# Chain ID must be 31337
# RPC URL must be http://localhost:8545
```

## 📞 Need Help?

1. Check error message carefully
2. Read relevant documentation:
   - QUICK_START_NEW.md
   - DEPLOYMENT.md
   - WHATS_NEW.md
3. Make sure all prerequisites are installed
4. Verify all terminals are running

## 🎉 Success Criteria

When working, you should see:

✅ Frontend at http://localhost:3000
✅ Backend API responding
✅ MetaMask connected
✅ Your address shown in top right
✅ Can switch between dashboards
✅ Charts displaying (even with test data)
✅ No console errors

**If you see all this, congratulations! The app is fully functional!** 🚀

---

**Time to Complete**: 30-60 minutes (depending on download speeds)

**Difficulty**: Medium (requires installing software and using terminal)

**Result**: Fully functional blockchain disaster relief platform running locally!
