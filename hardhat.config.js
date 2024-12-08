require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("dotenv").config();

const privateKeys = process.env.PRIVATE_KEYS || "";

module.exports = {
  defaultNetwork: "WorldChainSepoliaTestnet",
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      gas: "auto",
      gasPrice: "auto",
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: privateKeys.split(","),
    },
    WorldChainSepoliaTestnet: {
      url: `https://worldchain-sepolia.g.alchemy.com/v2/KusgRXoHnC2eAXWAK6_4oHoBIp2s1bC-`,
      chainId: 4801,
      accounts: [
        "0x882e1c6333878f3a77df7d9ae3230328f4b0668bf051a1915f2283eb29114756",
      ],
    },
  },
};
