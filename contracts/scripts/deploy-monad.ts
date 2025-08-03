import { ethers } from "hardhat";
import { verify } from "../utils/verify";

async function main() {
  console.log("🚀 Deploying Etherlink Fusion+ contracts to Monad...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Deploy HTLC Escrow contract
  console.log("\n📦 Deploying HTLCEtherlinkEscrow...");
  const HTLCEtherlinkEscrow = await ethers.getContractFactory("HTLCEtherlinkEscrow");
  const htlcEscrow = await HTLCEtherlinkEscrow.deploy();
  await htlcEscrow.deployed();
  console.log("✅ HTLCEtherlinkEscrow deployed to:", htlcEscrow.address);

  // Deploy Fusion Resolver contract
  console.log("\n📦 Deploying FusionResolver...");
  const FusionResolver = await ethers.getContractFactory("FusionResolver");
  const fusionResolver = await FusionResolver.deploy(htlcEscrow.address);
  await fusionResolver.deployed();
  console.log("✅ FusionResolver deployed to:", fusionResolver.address);

  // Set up permissions
  console.log("\n🔐 Setting up permissions...");
  const setResolverTx = await htlcEscrow.setAuthorizedResolver(fusionResolver.address, true);
  await setResolverTx.wait();
  console.log("✅ FusionResolver authorized on HTLC contract");

  // Verify contracts on Monad explorer (if supported)
  console.log("\n🔍 Verifying contracts...");
  try {
    await verify(htlcEscrow.address, []);
    console.log("✅ HTLCEtherlinkEscrow verified");
  } catch (error) {
    console.log("⚠️  Failed to verify HTLCEtherlinkEscrow:", error);
  }

  try {
    await verify(fusionResolver.address, [htlcEscrow.address]);
    console.log("✅ FusionResolver verified");
  } catch (error) {
    console.log("⚠️  Failed to verify FusionResolver:", error);
  }

  // Deployment summary
  console.log("\n🎉 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🌐 Network: Monad");
  console.log("📋 HTLCEtherlinkEscrow:", htlcEscrow.address);
  console.log("🔧 FusionResolver:", fusionResolver.address);
  console.log("👤 Deployer:", deployer.address);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Save deployment info
  const deploymentInfo = {
    network: "monad",
    chainId: await deployer.provider?.getNetwork().then(n => n.chainId),
    contracts: {
      htlcEscrow: htlcEscrow.address,
      fusionResolver: fusionResolver.address
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  console.log("\n💾 Deployment info saved to deployment-monad.json");
  require('fs').writeFileSync(
    'deployment-monad.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  return {
    htlcEscrow: htlcEscrow.address,
    fusionResolver: fusionResolver.address
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 