# 🛡️ AEGIS - Blockchain-Based Disaster Relief Platform

## Overview

**Aegis** is a revolutionary blockchain-based disaster relief platform that eliminates corruption, bureaucracy, and delays in emergency aid distribution. Built on Polygon with advanced smart contract technology, Aegis ensures that relief funds reach victims instantly and are spent only on essentials.

## 🎯 Core Features

### 1. **Purpose-Bound Tokens (PBTs)** - Anti-Corruption Engine
- **ERC-1155 Multi-Token Standard**: Each token type represents a specific spending category
- **Categorical Spend Enforcement**: Smart contracts prevent misuse
  - 🍎 Food Tokens → Only accepted by grocery stores
  - 💊 Medical Tokens → Only accepted by pharmacies
  - 📚 Education Tokens → Only accepted by schools
  - 🏠 Shelter Tokens → Only accepted by landlords
  - ⚡ Utilities Tokens → Only accepted by utility providers

### 2. **Offline Transactions** - Banking the Unconnected
- **NFC Card Support**: Victims can carry passive NFC cards
- **QR Code Payments**: Works with printed QR codes
- **Meta-Transactions**: Merchants relay transactions on behalf of victims
- **Zero Internet Required**: Victims don't need smartphones or connectivity

### 3. **Oracle-Triggered Flash Relief** - Automated Response
- **Chainlink Integration**: Real-time disaster data from USGS and meteorological agencies
- **Parametric Insurance Logic**: Automatic fund release when thresholds are met
  - Earthquake: ≥ 6.0 magnitude → Instant relief
  - Flood: ≥ 2.0 meters → Instant relief
  - Hurricane: ≥ 120 km/h → Instant relief
- **No Bureaucratic Delays**: Funds distributed in seconds, not days

### 4. **Instant Stablecoin Settlement** - Merchant Confidence
- **Atomic Swaps**: Relief tokens → USDC in a single transaction
- **Real-Time Payment**: Merchants receive digital dollars immediately
- **No Reimbursement Delays**: No waiting for government payments

### 5. **Gasless Transactions (ERC-4337)** - Zero Friction UX
- **Account Abstraction**: Victims don't need ETH for gas fees
- **Paymaster Contract**: Platform sponsors all transaction costs
- **Web2-Like Experience**: No MetaMask complexity for disaster victims

### 6. **Zero-Knowledge Identity** - Privacy & Dignity
- **zk-SNARKs**: Prove eligibility without revealing identity
- **Merkle Tree Verification**: Anonymous proof of disaster zone residency
- **On-Chain Privacy**: Names and addresses never appear on blockchain

---

## 🏗️ Architecture

### Smart Contracts

```
contracts/
├── AegisToken.sol              # ERC-1155 Purpose-Bound Tokens
├── CategoryManager.sol         # Merchant category verification
├── AegisVault.sol             # Stablecoin reserve & instant settlement
├── DisasterOracle.sol         # Chainlink oracle integration
├── MetaTransactionRelay.sol   # Offline transaction support
├── AegisPaymaster.sol         # ERC-4337 gas sponsorship
├── ZKIdentityVerifier.sol     # Zero-knowledge proof verification
└── MockERC20.sol              # Test USDC token
```

### Frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── VictimDashboard.js    # Victim interface
│   │   ├── MerchantDashboard.js  # Merchant interface
│   │   └── AdminDashboard.js     # Admin control panel
│   ├── App.js
│   └── App.css
└── public/
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- npm or yarn
- MetaMask or Web3 wallet

### Installation

```bash
# Install dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Configuration

1. Copy environment template:
```bash
cp .env.example .env
```

2. Update `.env` with your configuration:
```env
POLYGON_RPC_URL=https://polygon-rpc.com
PRIVATE_KEY=your_private_key_here
POLYGONSCAN_API_KEY=your_api_key
```

### Local Development

```bash
# Start local Hardhat node
npx hardhat node

# In a new terminal, deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Setup test data
npx hardhat run scripts/setup-test-data.js --network localhost

# Start frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Deploy to Polygon Mumbai (Testnet)

```bash
# Compile contracts
npx hardhat compile

# Deploy to Mumbai
npx hardhat run scripts/deploy.js --network mumbai

# Verify contracts (optional)
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

---

## 📖 User Guides

### For Disaster Victims

1. **Connect Wallet**: Use MetaMask or generate an offline QR code
2. **Verify Identity**: Submit zero-knowledge proof (no personal data revealed)
3. **Receive Tokens**: Get purpose-bound tokens after disaster verification
4. **Make Purchases**: 
   - Online: Transfer tokens to merchants directly
   - Offline: Show QR code to merchant who will relay transaction
5. **Track Balance**: Monitor token balances in real-time

### For Merchants

1. **Register**: Submit business verification and category
2. **Get Verified**: Platform admin verifies your business type
3. **Accept Tokens**: Scan victim QR codes or accept wallet transfers
4. **Redeem for USDC**: 
   - Click "Redeem" button
   - Tokens are burned, USDC sent instantly
   - No waiting for government reimbursement

### For Administrators

1. **Monitor Disasters**: View real-time oracle data
2. **Manage Thresholds**: Configure automatic trigger levels
3. **Register Merchants**: Verify and categorize merchants
4. **Add Responders**: Designate regional emergency responders
5. **Manual Override**: Trigger fund releases if needed

---

## 🔧 Technical Details

### Token Flow

```
1. Disaster Detected (Oracle)
   ↓
2. Smart Contract Mints Tokens
   ↓
3. Tokens Distributed to Victims
   ↓
4. Victim Purchases from Merchant
   ↓
5. Smart Contract Validates Category
   ↓
6. Transfer Allowed if Categories Match
   ↓
7. Merchant Redeems Tokens
   ↓
8. Tokens Burned, USDC Transferred (Atomic Swap)
```

### Security Features

- ✅ **Role-Based Access Control**: OpenZeppelin's AccessControl
- ✅ **Reentrancy Protection**: SafeERC20 for token operations
- ✅ **Replay Attack Prevention**: Nonce-based meta-transactions
- ✅ **Signature Verification**: ECDSA cryptographic signatures

### Gas Optimization

- Batch operations for multiple tokens
- Efficient storage patterns
- Minimal on-chain computations

---

## 📊 Contract Addresses

After deployment, addresses are saved to `deployed-addresses.json`

---

## 🌐 Supported Networks

- ✅ Polygon Mainnet
- ✅ Polygon Mumbai (Testnet)
- ✅ Hardhat Local Network

---

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Chainlink for decentralized oracle infrastructure
- Polygon for scalable blockchain infrastructure
- The disaster relief community for inspiration

---

**Built with ❤️ for humanity's resilience**