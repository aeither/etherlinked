import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    etherlinkTestnet: {
      url: "https://node.ghostnet.etherlink.com",
      chainId: 128123, // Etherlink testnet chain ID
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
    },
    etherlinkMainnet: {
      url: "https://node.mainnet.etherlink.com",
      chainId: 42793, // Etherlink mainnet chain ID
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
    },
    monadTestnet: {
      url: "https://rpc.testnet.monad.xyz",
      chainId: 1338, // Monad testnet chain ID
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
    },
    monadMainnet: {
      url: "https://rpc.monad.xyz",
      chainId: 1337, // Monad mainnet chain ID
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      etherlinkTestnet: "abc", // Placeholder - Etherlink may not have etherscan yet
      etherlinkMainnet: "abc",
      monadTestnet: "abc", // Placeholder - Monad may not have etherscan yet
      monadMainnet: "abc"
    },
    customChains: [
      {
        network: "etherlinkTestnet",
        chainId: 128123,
        urls: {
          apiURL: "https://explorer.ghostnet.etherlink.com/api",
          browserURL: "https://explorer.ghostnet.etherlink.com"
        }
      },
      {
        network: "etherlinkMainnet", 
        chainId: 42793,
        urls: {
          apiURL: "https://explorer.etherlink.com/api",
          browserURL: "https://explorer.etherlink.com"
        }
      },
      {
        network: "monadTestnet",
        chainId: 1338,
        urls: {
          apiURL: "https://explorer.testnet.monad.xyz/api",
          browserURL: "https://explorer.testnet.monad.xyz"
        }
      },
      {
        network: "monadMainnet",
        chainId: 1337,
        urls: {
          apiURL: "https://explorer.monad.xyz/api",
          browserURL: "https://explorer.monad.xyz"
        }
      }
    ]
  },
};

export default config;