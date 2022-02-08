// deploy/00_deploy_your_contract.js

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("Whitelist", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [10],
    log: true,
  });
};
module.exports.tags = ["Whitelist"];
