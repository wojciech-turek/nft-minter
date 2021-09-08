const { ethers } = require("hardhat");

async function main() {
  const ChainWaveNFT = await ethers.getContractFactory("ChainWaveNFT");
  console.log("Deploying...");
  const chainwave = await ChainWaveNFT.deploy();
  await chainwave.deployed();
  console.log("ChainWaveNFT deployed to: ", chainwave.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
