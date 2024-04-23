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
      url: "https://indulgent-fabled-dream.bsc-testnet.quiknode.pro/52473971ad5ccfea8f644b83b0d1d118716a9f63/",
      accounts: [process.env.PRIVATE_KEY]
    },
  },
};