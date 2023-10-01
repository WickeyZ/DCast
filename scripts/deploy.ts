const hre = require("hardhat");

async function main() {
  const DCast = await hre.ethers.getContractFactory("DCast");
  console.log("This is the ContractFactory for DCast:");
  console.log(DCast);
  // const gasLimit = 5000000; // Set a higher gas limit value
  const dcast = await DCast.deploy();
  console.log("This is the BaseContract & deploymentTransaction & Omit:");
  console.log(dcast);
  console.log("Smart contract is deployed to:", dcast.target);
}

main().catch((error) => {
  console.error("deploy error");
  console.error(error);
  process.exitCode = 1;
});