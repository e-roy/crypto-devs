// deploy/00_deploy_your_contract.js

// const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer, tokenOwner } = await getNamedAccounts();
  // const chainId = await getChainId();

  // console.log("inside deploy your contract");
  // console.log(deploy);
  // console.log(deployer);
  // console.log(tokenOwner);
  // console.log(chainId);

  await deploy("Whitelist", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: [tokenOwner],
    args: [10],
    log: true,
  });
};
module.exports.tags = ["Whitelist"];
