// deploy/05_deploy_exchange_contract
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

  let contractToken = fs
    .readFileSync(`./deployments/${networkName}/CryptoDevToken.json`)
    .toString();
  contractToken = JSON.parse(contractToken);

  const cryptoDevTokenAddress = contractToken.address;

  await deploy("Exchange", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [cryptoDevTokenAddress],
    log: true,
  });
};
module.exports.tags = ["Exchange"];
