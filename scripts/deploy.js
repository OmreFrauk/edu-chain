const hre = require("hardhat");

async function main() {
  const deployedContract = await hre.ethers.deployContract(
    "contracts/Counter.sol:Counter"
  );
  await deployedContract.waitForDeployment();
  console.log(`Counter contract deployed to ${deployedContract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
