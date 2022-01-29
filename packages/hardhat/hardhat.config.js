require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: "../../.env" });

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",

  networks: {
    hardhat: {
      chainId: 31337,
    },
    rinkeby: {
      chainId: 4,
      url: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
      accounts: [`${process.env.RINKEBY_PRIVATE_KEY}`],
    },
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
      accounts: [`${process.env.RINKEBY_PRIVATE_KEY}`],
    },
  },
};
