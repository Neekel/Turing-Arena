const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying TuringArena contracts to Mantle...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString(), "\n");

  // 1. Deploy AgentRegistry
  console.log("📝 Deploying AgentRegistry...");
  const AgentRegistry = await hre.ethers.getContractFactory("AgentRegistry");
  const agentRegistry = await AgentRegistry.deploy();
  await agentRegistry.waitForDeployment();
  const agentRegistryAddress = await agentRegistry.getAddress();
  console.log("✅ AgentRegistry deployed to:", agentRegistryAddress, "\n");

  // 2. Deploy VotingPool
  console.log("📝 Deploying VotingPool...");
  const VotingPool = await hre.ethers.getContractFactory("VotingPool");
  const votingPool = await VotingPool.deploy();
  await votingPool.waitForDeployment();
  const votingPoolAddress = await votingPool.getAddress();
  console.log("✅ VotingPool deployed to:", votingPoolAddress, "\n");

  // 3. Deploy TuringArena
  console.log("📝 Deploying TuringArena...");
  const TuringArena = await hre.ethers.getContractFactory("TuringArena");
  const turingArena = await TuringArena.deploy(agentRegistryAddress, votingPoolAddress);
  await turingArena.waitForDeployment();
  const turingArenaAddress = await turingArena.getAddress();
  console.log("✅ TuringArena deployed to:", turingArenaAddress, "\n");

  // 4. Register 3 AI agents
  console.log("🤖 Registering AI agents...");
  
  const agents = [
    { name: "Aggressor", personality: "Aggressor", risk: 80, strategy: "momentum" },
    { name: "Conservative", personality: "Conservative", risk: 20, strategy: "DCA" },
    { name: "MemeLord", personality: "MemeLord", risk: 90, strategy: "sentiment" }
  ];

  for (const agent of agents) {
    const tx = await agentRegistry.registerAgent(
      agent.name,
      agent.personality,
      agent.risk,
      agent.strategy
    );
    await tx.wait();
    console.log(`  ✓ Registered ${agent.name} (risk: ${agent.risk}%)`);
  }

  console.log("\n🎉 Deployment complete!\n");
  console.log("📋 Contract Addresses:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("AgentRegistry:", agentRegistryAddress);
  console.log("VotingPool:   ", votingPoolAddress);
  console.log("TuringArena:  ", turingArenaAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("📝 Next steps:");
  console.log("1. Verify contracts:");
  console.log(`   npx hardhat verify --network ${hre.network.name} ${agentRegistryAddress}`);
  console.log(`   npx hardhat verify --network ${hre.network.name} ${votingPoolAddress}`);
  console.log(`   npx hardhat verify --network ${hre.network.name} ${turingArenaAddress} ${agentRegistryAddress} ${votingPoolAddress}`);
  console.log("\n2. Update frontend .env with contract addresses");
  console.log("\n3. Start backend with these addresses\n");

  // Save addresses to file
  const fs = require("fs");
  const addresses = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    agentRegistry: agentRegistryAddress,
    votingPool: votingPoolAddress,
    turingArena: turingArenaAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    "deployed-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("💾 Addresses saved to deployed-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
