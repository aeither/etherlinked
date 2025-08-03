import { ethers } from "hardhat";
import { Contract } from "ethers";

async function main() {
  console.log("🚀 Deploying Etherlink Fusion+ contracts...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

  // Deploy HTLCEtherlinkEscrow
  console.log("\n📦 Deploying HTLCEtherlinkEscrow...");
  const HTLCEtherlinkEscrow = await ethers.getContractFactory("HTLCEtherlinkEscrow");
  const escrow = await HTLCEtherlinkEscrow.deploy(deployer.address);
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log("✅ HTLCEtherlinkEscrow deployed to:", escrowAddress);

  // Deploy FusionResolver
  console.log("\n📦 Deploying FusionResolver...");
  const FusionResolver = await ethers.getContractFactory("FusionResolver");
  const minimumStake = ethers.parseEther("0.1"); // 0.1 XTZ minimum stake
  const resolver = await FusionResolver.deploy(
    escrowAddress,
    deployer.address,
    minimumStake
  );
  await resolver.waitForDeployment();
  const resolverAddress = await resolver.getAddress();
  console.log("✅ FusionResolver deployed to:", resolverAddress);

  // Authorize the resolver in the escrow contract
  console.log("\n⚙️ Authorizing resolver...");
  const authTx = await escrow.setResolverAuthorization(resolverAddress, true);
  await authTx.wait();
  console.log("✅ Resolver authorized in escrow contract");

  // Display deployment summary
  console.log("\n📋 Deployment Summary:");
  console.log("========================");
  console.log("🏦 HTLCEtherlinkEscrow:", escrowAddress);
  console.log("🤖 FusionResolver:", resolverAddress);
  console.log("👤 Deployer:", deployer.address);
  console.log("⛽ Gas used for deployment: ~2.5M gas");

  // Save deployment info
  const deploymentInfo = {
    network: await ethers.provider.getNetwork(),
    contracts: {
      HTLCEtherlinkEscrow: escrowAddress,
      FusionResolver: resolverAddress
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    minimumStake: ethers.formatEther(minimumStake)
  };

  console.log("\n💾 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Verify contracts on Etherscan if not local
  if (process.env.VERIFY_CONTRACTS === "true") {
    console.log("\n🔍 Waiting for block confirmations...");
    await escrow.deploymentTransaction()?.wait(5);
    await resolver.deploymentTransaction()?.wait(5);

    console.log("📝 Verifying contracts...");
    try {
      await hre.run("verify:verify", {
        address: escrowAddress,
        constructorArguments: [deployer.address]
      });
      
      await hre.run("verify:verify", {
        address: resolverAddress,
        constructorArguments: [escrowAddress, deployer.address, minimumStake]
      });
      
      console.log("✅ Contracts verified successfully!");
    } catch (error) {
      console.log("❌ Verification failed:", error);
    }
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("🔗 You can now start the relayer service and frontend");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });