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

// import { ethers } from "hardhat";

// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const unlockTime = currentTimestampInSeconds + 60;

//   const lockedAmount = ethers.utils.parseEther("0.001");

//   const Lock = await ethers.getContractFactory("Lock");
//   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//   await lock.deployed();

//   console.log(
//     `Lock with ${ethers.utils.formatEther(lockedAmount)}ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
//   );
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
