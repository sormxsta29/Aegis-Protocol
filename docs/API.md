# API Documentation

## Smart Contract Functions

### AegisToken (ERC-1155)

#### Read Functions

```solidity
// Get token balance
function balanceOf(address account, uint256 id) → uint256

// Get batch balances
function balanceOfBatch(address[] accounts, uint256[] ids) → uint256[]

// Get token name
function getTokenName(uint256 tokenId) → string

// Get total supply of a token type
function totalSupply(uint256 id) → uint256
```

#### Write Functions

```solidity
// Mint tokens (MINTER_ROLE required)
function mint(address to, uint256 tokenId, uint256 amount, bytes data)

// Mint multiple token types
function mintBatch(address to, uint256[] tokenIds, uint256[] amounts, bytes data)

// Transfer tokens (enforces category restrictions)
function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)

// Batch transfer
function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data)
```

### CategoryManager

#### Read Functions

```solidity
// Check if merchant can receive token type
function canReceiveToken(address merchant, uint256 tokenId) → bool

// Get merchant category
function getMerchantCategory(address merchant) → Category

// Check merchant verification status
function isMerchantVerified(address merchant) → bool

// Get category name
function getCategoryName(Category category) → string
```

#### Write Functions

```solidity
// Register a merchant (REGISTRAR_ROLE required)
function registerMerchant(address merchant, Category category)

// Batch register merchants
function registerMerchantBatch(address[] merchants, Category[] categories)

// Revoke merchant verification
function revokeMerchant(address merchant)
```

### AegisVault

#### Read Functions

```solidity
// Get vault stablecoin balance
function getVaultBalance() → uint256

// Calculate redemption value
function calculateRedemptionValue(uint256 tokenId, uint256 amount) → uint256

// Get exchange rate
function exchangeRates(uint256 tokenId) → uint256

// Get total redeemed
function totalRedeemed(uint256 tokenId) → uint256
```

#### Write Functions

```solidity
// Deposit stablecoin into vault
function depositStablecoin(uint256 amount)

// Redeem tokens for stablecoin
function redeemTokens(uint256 tokenId, uint256 amount)

// Batch redeem
function redeemTokensBatch(uint256[] tokenIds, uint256[] amounts)

// Set exchange rate (ADMIN only)
function setExchangeRate(uint256 tokenId, uint256 rate)
```

### DisasterOracle

#### Read Functions

```solidity
// Get disaster event details
function disasters(bytes32 requestId) → DisasterEvent

// Get regional responders
function getRegionalResponders(string region) → address[]

// Get thresholds
function earthquakeThreshold() → uint256
function floodThreshold() → uint256
function hurricaneThreshold() → uint256
```

#### Write Functions

```solidity
// Request disaster data from oracle
function requestDisasterData(string apiEndpoint, string location) → bytes32

// Manual fund release (OWNER only)
function manualReleaseFunds(bytes32 disasterId, uint256 magnitude, string location)

// Add regional responder
function addRegionalResponder(string region, address responder)

// Update thresholds
function updateEarthquakeThreshold(uint256 newThreshold)
function updateFloodThreshold(uint256 newThreshold)
function updateHurricaneThreshold(uint256 newThreshold)
```

### MetaTransactionRelay

#### Read Functions

```solidity
// Get user nonce
function getNonce(address user) → uint256

// Verify signature
function verifySignature(address from, address to, uint256 value, bytes data, bytes signature) → bool

// Get message hash for signing
function getMessageHash(address from, address to, uint256 value, bytes data, uint256 nonce) → bytes32
```

#### Write Functions

```solidity
// Execute meta-transaction (trusted relayer only)
function executeMetaTransaction(
    address from,
    address to,
    uint256 value,
    bytes data,
    bytes signature
) → bytes
```

### AegisPaymaster

#### Read Functions

```solidity
// Check if user is sponsored
function isUserSponsored(address user) → bool

// Get deposit balance
function getDeposit() → uint256

// Estimate gas cost
function estimateCost(uint256 gasLimit) → uint256
```

#### Write Functions

```solidity
// Add sponsored user (OWNER only)
function addSponsoredUser(address user)

// Batch add sponsored users
function addSponsoredUserBatch(address[] users)

// Revoke sponsorship
function revokeSponsoredUser(address user)

// Set max gas limit
function setMaxGasLimit(uint256 newLimit)
```

### ZKIdentityVerifier

#### Read Functions

```solidity
// Check if user is verified
function isUserVerified(address user) → bool

// Check if proof hash is used
function isProofUsed(bytes32 proofHash) → bool

// Generate proof hash
function generateProofHash(bytes proof, uint256[] publicSignals, address user) → bytes32
```

#### Write Functions

```solidity
// Verify zero-knowledge proof
function verifyProof(bytes proof, uint256[] publicSignals) → bool

// Batch verify proofs
function verifyProofBatch(bytes[] proofs, uint256[][] publicSignalsArray) → bool[]

// Update merkle root (OWNER only)
function updateMerkleRoot(bytes32 newRoot)
```

---

## Events

### AegisToken Events

```solidity
event TokensMinted(address indexed to, uint256 indexed tokenId, uint256 amount)
event TokensDistributed(address indexed to, uint256[] tokenIds, uint256[] amounts)
event CategoryManagerUpdated(address indexed newManager)
```

### CategoryManager Events

```solidity
event MerchantRegistered(address indexed merchant, Category category)
event MerchantVerified(address indexed merchant)
event MerchantRevoked(address indexed merchant)
```

### AegisVault Events

```solidity
event TokensRedeemed(address indexed merchant, uint256 indexed tokenId, uint256 tokenAmount, uint256 stablecoinAmount)
event ExchangeRateUpdated(uint256 indexed tokenId, uint256 newRate)
event StablecoinDeposited(address indexed depositor, uint256 amount)
event StablecoinWithdrawn(address indexed recipient, uint256 amount)
```

### DisasterOracle Events

```solidity
event DisasterReported(bytes32 indexed requestId, string location)
event DisasterDataReceived(bytes32 indexed requestId, uint256 magnitude, string location)
event FundsReleased(bytes32 indexed disasterId, address[] responders, uint256 totalAmount)
event ThresholdUpdated(string indexed parameterType, uint256 newThreshold)
event ResponderAdded(string indexed region, address responder)
```

---

## Integration Examples

### JavaScript/Web3.js

```javascript
const { ethers } = require('ethers');

// Connect to contract
const aegisToken = new ethers.Contract(
  AEGIS_TOKEN_ADDRESS,
  AegisTokenABI,
  signer
);

// Mint tokens
await aegisToken.mint(
  recipientAddress,
  1, // Food token
  ethers.parseEther("100"),
  "0x"
);

// Transfer tokens
await aegisToken.safeTransferFrom(
  senderAddress,
  merchantAddress,
  1,
  ethers.parseEther("50"),
  "0x"
);
```

### Python/Web3.py

```python
from web3 import Web3

w3 = Web3(Web3.HTTPProvider('https://polygon-rpc.com'))

# Contract instance
aegis_token = w3.eth.contract(
    address=AEGIS_TOKEN_ADDRESS,
    abi=AEGIS_TOKEN_ABI
)

# Get balance
balance = aegis_token.functions.balanceOf(
    user_address,
    1  # Token ID
).call()
```

---

## Error Codes

| Error | Description |
|-------|-------------|
| `Invalid token ID` | Token ID must be between 1-5 |
| `Recipient not authorized for this category` | Merchant category doesn't match token type |
| `Category manager not set` | CategoryManager contract not configured |
| `Insufficient vault balance` | Not enough USDC in vault for redemption |
| `User not sponsored` | User not whitelisted for gasless transactions |
| `Proof already used` | ZK proof has been used (replay attack) |
| `Not a trusted relayer` | Only registered relayers can execute meta-transactions |

---

## Rate Limits

- Oracle requests: 10 per hour
- Meta-transactions: 100 per day per user
- Batch operations: Max 50 items per batch

---

## Network Details

### Polygon Mumbai (Testnet)

- RPC URL: `https://rpc-mumbai.maticvigil.com`
- Chain ID: `80001`
- Block Explorer: `https://mumbai.polygonscan.com`
- LINK Token: `0x326C977E6efc84E512bB9C30f76E30c160eD06FB`

### Polygon Mainnet

- RPC URL: `https://polygon-rpc.com`
- Chain ID: `137`
- Block Explorer: `https://polygonscan.com`
- USDC Token: `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`
