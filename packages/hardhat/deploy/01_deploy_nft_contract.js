// deploy/01_deploy_nft_contract.js
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

  let contract = fs
    .readFileSync(`./deployments/${networkName}/Whitelist.json`)
    .toString();
  contract = JSON.parse(contract);
  const WHITELIST_CONTRACT_ADDRESS = contract.address;
  const METADATA_URL = contract.metadata;

  await deploy("CryptoDevs", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [METADATA_URL, WHITELIST_CONTRACT_ADDRESS],
    log: true,
  });
};
module.exports.tags = ["CryptoDevs"];
