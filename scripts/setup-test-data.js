const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🧪 Starting test setup...\n");

  // Load deployed addresses
  const addresses = JSON.parse(fs.readFileSync("deployed-addresses.json"));
  
  const [deployer, victim1, merchant1, responder1] = await hre.ethers.getSigners();

  // Get contract instances
  const aegisToken = await hre.ethers.getContractAt("AegisToken", addresses.AegisToken);
  const categoryManager = await hre.ethers.getContractAt("CategoryManager", addresses.CategoryManager);
  const aegisVault = await hre.ethers.getContractAt("AegisVault", addresses.AegisVault);
  const disasterOracle = await hre.ethers.getContractAt("DisasterOracle", addresses.DisasterOracle);
  const paymaster = await hre.ethers.getContractAt("AegisPaymaster", addresses.AegisPaymaster);

  console.log("1️⃣ Registering test merchant...");
  await categoryManager.registerMerchant(merchant1.address, 1); // Category 1 = GROCERY
  console.log("✅ Merchant registered:", merchant1.address);
  console.log("");

  console.log("2️⃣ Adding victim to sponsored users (gasless)...");
  await paymaster.addSponsoredUser(victim1.address);
  console.log("✅ Victim sponsored:", victim1.address);
  console.log("");

  console.log("3️⃣ Minting relief tokens to victim...");
  const tokenIds = [1, 2, 3, 4, 5]; // All token types
  const amounts = [
    hre.ethers.parseEther("500"),  // Food
    hre.ethers.parseEther("300"),  // Medical
    hre.ethers.parseEther("200"),  // Education
    hre.ethers.parseEther("400"),  // Shelter
    hre.ethers.parseEther("250")   // Utilities
  ];
  
  await aegisToken.mintBatch(victim1.address, tokenIds, amounts, "0x");
  console.log("✅ Tokens minted to victim");
  console.log("");

  console.log("4️⃣ Adding regional responder...");
  await disasterOracle.addRegionalResponder("REGION_A", responder1.address);
  console.log("✅ Responder added for REGION_A");
  console.log("");

  console.log("5️⃣ Checking balances...");
  const foodBalance = await aegisToken.balanceOf(victim1.address, 1);
  console.log("Victim Food Tokens:", hre.ethers.formatEther(foodBalance));
  
  const merchantVerified = await categoryManager.isMerchantVerified(merchant1.address);
  console.log("Merchant Verified:", merchantVerified);
  
  const victimSponsored = await paymaster.isUserSponsored(victim1.address);
  console.log("Victim Gas Sponsored:", victimSponsored);
  console.log("");

  console.log("=".repeat(80));
  console.log("✅ TEST SETUP COMPLETE!");
  console.log("=".repeat(80));
  console.log("\nTest Accounts:");
  console.log("Deployer:  ", deployer.address);
  console.log("Victim:    ", victim1.address);
  console.log("Merchant:  ", merchant1.address);
  console.log("Responder: ", responder1.address);
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
