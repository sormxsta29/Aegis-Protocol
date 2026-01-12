# AEGIS Tutorial: Complete Walkthrough

## Table of Contents
1. [System Setup](#system-setup)
2. [Smart Contract Deployment](#smart-contract-deployment)
3. [Frontend Setup](#frontend-setup)
4. [User Workflows](#user-workflows)
5. [Advanced Features](#advanced-features)

---

## System Setup

### 1. Install Dependencies

```bash
# Install Node.js packages
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Configure Environment

Create a `.env` file:

```env
# Network Configuration
POLYGON_RPC_URL=https://polygon-rpc.com
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com

# Private Key (NEVER commit this!)
PRIVATE_KEY=your_private_key_here

# API Keys
POLYGONSCAN_API_KEY=your_polygonscan_api_key
CHAINLINK_NODE_URL=your_chainlink_node_url
```

---

## Smart Contract Deployment

### Local Development (Hardhat)

```bash
# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Setup test data
npx hardhat run scripts/setup-test-data.js --network localhost
```

Expected output:
```
🚀 Starting Aegis Blockchain Relief System deployment...

✅ AegisToken deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
✅ CategoryManager deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
✅ AegisVault deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
...
```

### Testnet Deployment (Polygon Mumbai)

```bash
# Compile contracts
npx hardhat compile

# Deploy to Mumbai
npx hardhat run scripts/deploy.js --network mumbai

# Verify on Polygonscan
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

### Mainnet Deployment (Polygon)

⚠️ **WARNING**: Only deploy to mainnet after thorough testing and security audits!

```bash
# Deploy to Polygon mainnet
npx hardhat run scripts/deploy.js --network polygon
```

---

## Frontend Setup

### 1. Start Development Server

```bash
cd frontend
npm run dev
```

The application will open at `http://localhost:3000`

### 2. Connect Wallet

1. Install MetaMask browser extension
2. Add Polygon Mumbai network:
   - Network Name: `Mumbai Testnet`
   - RPC URL: `https://rpc-mumbai.maticvigil.com`
   - Chain ID: `80001`
   - Symbol: `MATIC`
   - Explorer: `https://mumbai.polygonscan.com`

3. Get test MATIC from faucet:
   - Visit: https://faucet.polygon.technology/
   - Enter your wallet address
   - Receive free test MATIC

---

## User Workflows

### Workflow 1: Disaster Victim Journey

#### Step 1: Receive Relief Tokens

After a disaster is detected by the oracle:

```javascript
// Admin manually releases funds OR oracle auto-triggers
const tx = await disasterOracle.manualReleaseFunds(
  disasterId,
  65, // 6.5 magnitude earthquake
  "REGION_A"
);
```

Victims registered in REGION_A automatically receive tokens:
- 200 Food Tokens
- 120 Medical Tokens
- 80 Education Tokens
- 160 Shelter Tokens
- 100 Utilities Tokens

#### Step 2: Verify Identity (Zero-Knowledge)

```javascript
// Generate ZK proof (off-chain)
const proof = generateZKProof(userAddress, disasterZone);

// Submit proof to contract
await zkIdentityVerifier.verifyProof(proof, publicSignals);
```

User is verified without revealing:
- Name
- Age
- Exact address
- Personal information

#### Step 3: Spend Tokens

**Online Purchase:**
```javascript
// Transfer food tokens to grocery store
await aegisToken.safeTransferFrom(
  victimAddress,
  groceryStoreAddress,
  1, // Food token ID
  ethers.parseEther("50"),
  "0x"
);
```

**Offline Purchase:**
1. Generate QR code containing signed transaction
2. Merchant scans QR code
3. Merchant submits meta-transaction:

```javascript
await metaTransactionRelay.executeMetaTransaction(
  victimAddress,      // Victim who signed
  groceryStoreAddress, // Merchant
  0,                  // No ETH value
  encodedData,        // Transfer function call
  signature           // Victim's signature
);
```

---

### Workflow 2: Merchant Journey

#### Step 1: Register as Merchant

```javascript
// Admin registers merchant with category
await categoryManager.registerMerchant(
  merchantAddress,
  1 // Category: GROCERY
);
```

Categories:
- 1: Grocery Store
- 2: Pharmacy
- 3: School
- 4: Landlord
- 5: Utility Provider

#### Step 2: Accept Relief Tokens

When a victim makes a purchase:

1. **Automatic Category Validation**: Smart contract checks if merchant category matches token type
2. **Transfer Executes**: If valid, tokens transfer to merchant
3. **Transaction Logged**: Event emitted on blockchain

#### Step 3: Redeem for USDC

```javascript
// Merchant redeems food tokens for USDC
await aegisVault.redeemTokens(
  1, // Food token ID
  ethers.parseEther("150") // Amount to redeem
);
```

**What happens:**
1. Tokens are burned from merchant's wallet
2. USDC is transferred from vault to merchant
3. Exchange rate: 1 token = 1 USDC (configurable)
4. **Instant settlement** - no delays!

**Batch Redemption:**
```javascript
await aegisVault.redeemTokensBatch(
  [1, 2], // Food and Medical tokens
  [ethers.parseEther("150"), ethers.parseEther("80")]
);
```

---

### Workflow 3: Administrator Journey

#### Step 1: Monitor Disasters

```javascript
// Oracle automatically fetches earthquake data
const requestId = await disasterOracle.requestDisasterData(
  "https://earthquake.usgs.gov/fdsnws/event/1/query",
  "REGION_A"
);

// When data is received, oracle callback executes
// If magnitude >= threshold, funds auto-release
```

#### Step 2: Register Regional Responders

```javascript
// Add NGOs and first responders
await disasterOracle.addRegionalResponderBatch(
  "REGION_A",
  [ngo1Address, ngo2Address, firstResponderAddress]
);
```

#### Step 3: Manage Thresholds

```javascript
// Update earthquake trigger threshold
await disasterOracle.updateEarthquakeThreshold(70); // 7.0 magnitude

// Update flood threshold
await disasterOracle.updateFloodThreshold(250); // 2.5 meters

// Update hurricane threshold
await disasterOracle.updateHurricaneThreshold(150); // 150 km/h
```

#### Step 4: Fund the Vault

```javascript
// Deposit USDC into vault for merchant redemptions
const usdc = await ethers.getContractAt("IERC20", usdcAddress);

await usdc.approve(vaultAddress, ethers.parseUnits("1000000", 6));
await aegisVault.depositStablecoin(ethers.parseUnits("1000000", 6));
```

---

## Advanced Features

### Feature 1: Meta-Transactions (Offline Support)

**Scenario**: Victim has no internet but needs to buy food

**Solution**:
1. Victim's device generates signed transaction offline
2. QR code contains: `{from, to, value, data, signature}`
3. Merchant with internet scans QR and relays transaction

**Code**:
```javascript
// Victim generates signature (can be offline)
const nonce = await metaTransactionRelay.getNonce(victimAddress);
const messageHash = await metaTransactionRelay.getMessageHash(
  victimAddress,
  merchantAddress,
  0,
  encodedData,
  nonce
);

const signature = await victimWallet.signMessage(messageHash);

// Merchant executes (online)
await metaTransactionRelay.executeMetaTransaction(
  victimAddress,
  merchantAddress,
  0,
  encodedData,
  signature
);
```

---

### Feature 2: Gasless Transactions (ERC-4337)

**Scenario**: Victim has no MATIC for gas fees

**Solution**: Paymaster pays gas on their behalf

**Setup**:
```javascript
// Admin adds victim to sponsored list
await aegisPaymaster.addSponsoredUserBatch([
  victim1Address,
  victim2Address,
  victim3Address
]);

// Fund paymaster with ETH/MATIC
await deployer.sendTransaction({
  to: paymasterAddress,
  value: ethers.parseEther("10")
});
```

**Result**: Victims can make transactions without owning any MATIC!

---

### Feature 3: Zero-Knowledge Identity

**Scenario**: Prove eligibility without revealing identity

**Circuit Logic** (Circom):
```circom
template EligibilityProof() {
    signal input userAddress;
    signal input disasterZone;
    signal input secretKey;
    
    signal output isEligible;
    
    // Verify user is in merkle tree of eligible addresses
    // without revealing which leaf
}
```

**Integration**:
```javascript
// Generate proof off-chain
const { proof, publicSignals } = await snarkjs.groth16.fullProve(
  { userAddress, disasterZone, secretKey },
  wasmFile,
  zkeyFile
);

// Verify on-chain
await zkIdentityVerifier.verifyProof(proof, publicSignals);
```

---

### Feature 4: Oracle Automation

**Setup Chainlink Automation**:

```javascript
// Configure oracle job
const jobId = "ca98366cc7314957b8c012c72f05aeeb";

await disasterOracle.updateOracleConfig(
  chainlinkOracleAddress,
  jobId,
  ethers.parseUnits("0.1", 18) // 0.1 LINK fee
);

// Fund oracle with LINK
const linkToken = await ethers.getContractAt("IERC20", linkAddress);
await linkToken.transfer(
  disasterOracleAddress,
  ethers.parseUnits("10", 18)
);
```

**Automatic Workflow**:
1. Oracle checks USGS API every 10 minutes
2. If earthquake > 6.0 detected → auto-trigger
3. Smart contract mints tokens
4. Tokens distributed to regional responders
5. No human intervention needed!

---

## Testing

### Unit Tests

```bash
# Run all tests
npx hardhat test

# Test specific contract
npx hardhat test test/AegisToken.test.js

# With gas reporting
REPORT_GAS=true npx hardhat test
```

### Integration Tests

```bash
# Test complete flow
npx hardhat test test/integration/DisasterFlow.test.js
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## Production Checklist

Before deploying to mainnet:

- [ ] Complete security audit by professional firm
- [ ] Test on testnet for at least 30 days
- [ ] Implement emergency pause mechanism
- [ ] Setup multi-sig wallet for admin functions
- [ ] Configure monitoring and alerts
- [ ] Integrate with real disaster APIs
- [ ] Legal compliance review
- [ ] User acceptance testing
- [ ] Disaster response coordination
- [ ] Insurance and liability coverage

---

## Troubleshooting

### Common Issues

**Issue**: Transaction reverts with "Recipient not authorized"
- **Solution**: Merchant category doesn't match token type. Register merchant with correct category.

**Issue**: "Insufficient vault balance"
- **Solution**: Vault needs more USDC. Admin should deposit funds.

**Issue**: Oracle not triggering
- **Solution**: Fund oracle contract with LINK tokens.

**Issue**: Gas fees too high
- **Solution**: Ensure paymaster is funded and user is on sponsored list.

---

## Support & Resources

- 📖 Full API Documentation: `docs/API.md`
- 🔍 Contract Addresses: `deployed-addresses.json`
- 💬 Community Discord: [link]
- 🐛 Report Issues: GitHub Issues
- 📧 Contact: support@aegis.relief

---

**Tutorial Complete! You're ready to deploy disaster relief on blockchain! 🚀**
