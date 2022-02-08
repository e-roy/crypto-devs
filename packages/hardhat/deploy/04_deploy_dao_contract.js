// deploy/04_deploy_dao_contract.js
const fs = require("fs");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

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

  await deploy("CryptoDevsDAO", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [fakeMarketplaceContract, cryptoDevsNFTContract],
    log: true,
  });
};
module.exports.tags = ["CryptoDevsDAO"];
