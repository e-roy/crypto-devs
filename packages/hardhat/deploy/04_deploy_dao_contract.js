// deploy/04_deploy_dao_contract.js
const fs = require("fs");
const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer, tokenOwner } = await getNamedAccounts();

  const chainId = await getChainId();

  let networkName = "localhost";
  if (chainId == 1) {
    networkName = "mainnet";
  } else if (chainId == 4) {
    networkName = "rinkeby";
  } else if (chainId == 31337) {
    networkName = "localhost";
  }

  let contractNFT = fs
    .readFileSync(`./deployments/${networkName}/CryptoDevs.json`)
    .toString();
  contractNFT = JSON.parse(contractNFT);

  const cryptoDevsNFTContract = contractNFT.address;

  let contractMarketplace = fs
    .readFileSync(`./deployments/${networkName}/FakeNFTMarketplace.json`)
    .toString();
  contractMarketplace = JSON.parse(contractMarketplace);

  const fakeMarketplaceContract = contractMarketplace.address;

  console.log(deployer);
  console.log(cryptoDevsNFTContract);
  console.log(fakeMarketplaceContract);

  await deploy("CryptoDevsDAO", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [
      fakeMarketplaceContract,
      cryptoDevsNFTContract,
      // {
      //   value: ethers.utils.parseEther("0.1"),
      // },
    ],
    log: true,
  });
};
module.exports.tags = ["CryptoDevsDAO"];
