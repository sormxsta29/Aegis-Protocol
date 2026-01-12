const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting Aegis Blockchain Relief System deployment...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
  console.log("");

  // 1. Deploy AegisToken (ERC-1155 Purpose-Bound Tokens)
  console.log("📝 Deploying AegisToken...");
  const AegisToken = await hre.ethers.getContractFactory("AegisToken");
  const aegisToken = await AegisToken.deploy("https://api.aegis.relief/metadata/{id}.json");
  await aegisToken.waitForDeployment();
  const aegisTokenAddress = await aegisToken.getAddress();
  console.log("✅ AegisToken deployed to:", aegisTokenAddress);
  console.log("");

  // 2. Deploy CategoryManager
  console.log("📝 Deploying CategoryManager...");
  const CategoryManager = await hre.ethers.getContractFactory("CategoryManager");
  const categoryManager = await CategoryManager.deploy();
  await categoryManager.waitForDeployment();
  const categoryManagerAddress = await categoryManager.getAddress();
  console.log("✅ CategoryManager deployed to:", categoryManagerAddress);
  console.log("");

  // 3. Link AegisToken with CategoryManager
  console.log("🔗 Linking AegisToken with CategoryManager...");
  await aegisToken.setCategoryManager(categoryManagerAddress);
  console.log("✅ CategoryManager linked to AegisToken");
  console.log("");

  // 4. Deploy Mock USDC (for testing - use real USDC in production)
  console.log("📝 Deploying Mock USDC...");
  const MockUSDC = await hre.ethers.getContractFactory("MockERC20");
  const mockUSDC = await MockUSDC.deploy("USD Coin", "USDC", 6); // 6 decimals for USDC
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("✅ Mock USDC deployed to:", mockUSDCAddress);
  console.log("");

  // 5. Deploy AegisVault
  console.log("📝 Deploying AegisVault...");
  const AegisVault = await hre.ethers.getContractFactory("AegisVault");
  const aegisVault = await AegisVault.deploy(aegisTokenAddress, mockUSDCAddress);
  await aegisVault.waitForDeployment();
  const aegisVaultAddress = await aegisVault.getAddress();
  console.log("✅ AegisVault deployed to:", aegisVaultAddress);
  console.log("");

  // 6. Grant MINTER_ROLE to deployer for initial setup
  console.log("🔑 Setting up roles...");
  const MINTER_ROLE = await aegisToken.MINTER_ROLE();
  await aegisToken.grantRole(MINTER_ROLE, deployer.address);
  console.log("✅ Minter role granted to deployer");
  console.log("");

  // 7. Deploy DisasterOracle (requires Chainlink setup)
  console.log("📝 Deploying DisasterOracle...");
  // Note: Update these addresses for your network
  const LINK_TOKEN = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"; // Polygon Mumbai
  const CHAINLINK_ORACLE = "0x40193c8518BB267228Fc409a613bDbD8eC5a97b3"; // Polygon Mumbai
  
  const DisasterOracle = await hre.ethers.getContractFactory("DisasterOracle");
  const disasterOracle = await DisasterOracle.deploy(
    aegisTokenAddress,
    mockUSDCAddress,
    LINK_TOKEN,
    CHAINLINK_ORACLE
  );
  await disasterOracle.waitForDeployment();
  const disasterOracleAddress = await disasterOracle.getAddress();
  console.log("✅ DisasterOracle deployed to:", disasterOracleAddress);
  console.log("");

  // Grant MINTER_ROLE to DisasterOracle for automated relief
  await aegisToken.grantRole(MINTER_ROLE, disasterOracleAddress);
  console.log("✅ Minter role granted to DisasterOracle");
  console.log("");

  // 8. Deploy MetaTransactionRelay
  console.log("📝 Deploying MetaTransactionRelay...");
  const MetaTransactionRelay = await hre.ethers.getContractFactory("MetaTransactionRelay");
  const metaTransactionRelay = await MetaTransactionRelay.deploy();
  await metaTransactionRelay.waitForDeployment();
  const metaTransactionRelayAddress = await metaTransactionRelay.getAddress();
  console.log("✅ MetaTransactionRelay deployed to:", metaTransactionRelayAddress);
  console.log("");

  // 9. Deploy AegisPaymaster
  console.log("📝 Deploying AegisPaymaster...");
  const AegisPaymaster = await hre.ethers.getContractFactory("AegisPaymaster");
  const aegisPaymaster = await AegisPaymaster.deploy();
  await aegisPaymaster.waitForDeployment();
  const aegisPaymasterAddress = await aegisPaymaster.getAddress();
  console.log("✅ AegisPaymaster deployed to:", aegisPaymasterAddress);
  console.log("");

  // 10. Deploy ZKIdentityVerifier
  console.log("📝 Deploying ZKIdentityVerifier...");
  const initialMerkleRoot = hre.ethers.ZeroHash; // Update with actual merkle root
  const ZKIdentityVerifier = await hre.ethers.getContractFactory("ZKIdentityVerifier");
  const zkIdentityVerifier = await ZKIdentityVerifier.deploy(initialMerkleRoot);
  await zkIdentityVerifier.waitForDeployment();
  const zkIdentityVerifierAddress = await zkIdentityVerifier.getAddress();
  console.log("✅ ZKIdentityVerifier deployed to:", zkIdentityVerifierAddress);
  console.log("");

  // 11. Fund the paymaster with some ETH
  console.log("💰 Funding Paymaster...");
  await deployer.sendTransaction({
    to: aegisPaymasterAddress,
    value: hre.ethers.parseEther("1.0")
  });
  console.log("✅ Paymaster funded with 1 ETH");
  console.log("");

  // 12. Mint some USDC to the vault (for testing)
  console.log("💵 Minting USDC to vault...");
  await mockUSDC.mint(aegisVaultAddress, hre.ethers.parseUnits("1000000", 6)); // 1M USDC
  console.log("✅ Vault funded with 1,000,000 USDC");
  console.log("");

  // Print summary
  console.log("=".repeat(80));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(80));
  console.log("\n📋 Contract Addresses:\n");
  console.log("AegisToken:           ", aegisTokenAddress);
  console.log("CategoryManager:      ", categoryManagerAddress);
  console.log("AegisVault:           ", aegisVaultAddress);
  console.log("DisasterOracle:       ", disasterOracleAddress);
  console.log("MetaTransactionRelay: ", metaTransactionRelayAddress);
  console.log("AegisPaymaster:       ", aegisPaymasterAddress);
  console.log("ZKIdentityVerifier:   ", zkIdentityVerifierAddress);
  console.log("Mock USDC:            ", mockUSDCAddress);
  console.log("\n" + "=".repeat(80));

  // Save addresses to file
  const fs = require("fs");
  const addresses = {
    network: hre.network.name,
    AegisToken: aegisTokenAddress,
    CategoryManager: categoryManagerAddress,
    AegisVault: aegisVaultAddress,
    DisasterOracle: disasterOracleAddress,
    MetaTransactionRelay: metaTransactionRelayAddress,
    AegisPaymaster: aegisPaymasterAddress,
    ZKIdentityVerifier: zkIdentityVerifierAddress,
    MockUSDC: mockUSDCAddress
  };

  fs.writeFileSync(
    "deployed-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("\n✅ Addresses saved to deployed-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
