require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    Amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: [process.env.PRIVATE_KEY]
    },
    BSC: {
      url: "https://bsc-testnet-rpc.publicnode.com",
      accounts: [process.env.PRIVATE_KEY]
    },
  },
};