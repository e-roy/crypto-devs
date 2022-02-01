// deploy/02_deploy_ico_contract.js
const fs = require("fs");

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

  let contract = fs
    .readFileSync(`./deployments/${networkName}/CryptoDevs.json`)
    .toString();
  contract = JSON.parse(contract);

  const cryptoDevsNFTContract = contract.address;

  await deploy("CryptoDevToken", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [cryptoDevsNFTContract],
    log: true,
  });
};
module.exports.tags = ["CryptoDevToken"];
