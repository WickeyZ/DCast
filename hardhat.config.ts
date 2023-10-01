require('dotenv').config({path: __dirname + '/.env.local'})
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.18",
  networks: {
    // NETWORK 1: HARDHAT LOCAL NODE
    hardhat: {
      chainId: 1337,
    },
    // NETWORK 2: GANACHE LOCAL NODE
    localganache: {
      url: process.env.GANACHE_PROVIDER_URL,
      accounts: [
        // ganache account private key
        `0x${process.env.OWNER_PRIVATE_KEY}`,
      ],
    },
    // NETWORK 3: SEPOLIA TEST NET
    sepolia : {
      url: `https://sepolia.infura.io/v3/${process.env.SEPOLIA_PROVIDER_URL}`,
      accounts: [
        // sepolia account private key
        `0x${process.env.SEPOLIA_PRIVATE_KEY}`
      ]
    }
  },
};