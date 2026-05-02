const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const address = deployer.address;
  const balance = await hre.ethers.provider.getBalance(address);
  const balanceInEth = hre.ethers.formatEther(balance);

  console.log("Wallet Address:", address);
  console.log("Balance:", balanceInEth, "MNT");
  console.log("");
  
  if (parseFloat(balanceInEth) === 0) {
    console.log("❌ No testnet MNT found!");
    console.log("Get testnet MNT from: https://faucet.sepolia.mantle.xyz");
  } else {
    console.log("✅ Ready to deploy!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
