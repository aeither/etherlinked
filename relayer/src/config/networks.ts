/**
 * Network configuration for Etherlink Fusion+ relayer
 */

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  blockTime: number; // in milliseconds
  confirmations: number;
  gasLimit: number;
  maxGasPrice: string; // in wei
  contractAddresses: {
    htlcEscrow?: string;
    fusionResolver?: string;
  };
}

export const NETWORKS: Record<string, NetworkConfig> = {
  // Etherlink Networks
  etherlinkMainnet: {
    name: "Etherlink Mainnet",
    chainId: 42793,
    rpcUrl: "https://node.mainnet.etherlink.com",
    blockTime: 500, // Sub-500ms confirmation
    confirmations: 1,
    gasLimit: 10000000,
    maxGasPrice: "2000000000", // 2 gwei
    contractAddresses: {
      htlcEscrow: process.env.ETHERLINK_MAINNET_ESCROW || "",
      fusionResolver: process.env.ETHERLINK_MAINNET_RESOLVER || ""
    }
  },
  
  etherlinkTestnet: {
    name: "Etherlink Testnet",
    chainId: 128123,
    rpcUrl: "https://node.ghostnet.etherlink.com",
    blockTime: 500,
    confirmations: 1,
    gasLimit: 10000000,
    maxGasPrice: "2000000000",
    contractAddresses: {
      htlcEscrow: process.env.ETHERLINK_TESTNET_ESCROW || "",
      fusionResolver: process.env.ETHERLINK_TESTNET_RESOLVER || ""
    }
  },

  // Other EVM networks for cross-chain
  ethereum: {
    name: "Ethereum Mainnet",
    chainId: 1,
    rpcUrl: process.env.ETHEREUM_RPC || "https://eth.llamarpc.com",
    blockTime: 12000, // 12 seconds
    confirmations: 3,
    gasLimit: 500000,
    maxGasPrice: "50000000000", // 50 gwei
    contractAddresses: {
      htlcEscrow: process.env.ETHEREUM_ESCROW || ""
    }
  },

  arbitrum: {
    name: "Arbitrum One",
    chainId: 42161,
    rpcUrl: process.env.ARBITRUM_RPC || "https://arb1.arbitrum.io/rpc",
    blockTime: 300, // ~300ms
    confirmations: 1,
    gasLimit: 2000000,
    maxGasPrice: "2000000000",
    contractAddresses: {
      htlcEscrow: process.env.ARBITRUM_ESCROW || ""
    }
  },

  optimism: {
    name: "Optimism",
    chainId: 10,
    rpcUrl: process.env.OPTIMISM_RPC || "https://mainnet.optimism.io",
    blockTime: 2000, // 2 seconds
    confirmations: 1,
    gasLimit: 2000000,
    maxGasPrice: "2000000000",
    contractAddresses: {
      htlcEscrow: process.env.OPTIMISM_ESCROW || ""
    }
  },

  polygon: {
    name: "Polygon",
    chainId: 137,
    rpcUrl: process.env.POLYGON_RPC || "https://polygon-rpc.com",
    blockTime: 2000,
    confirmations: 5,
    gasLimit: 2000000,
    maxGasPrice: "50000000000",
    contractAddresses: {
      htlcEscrow: process.env.POLYGON_ESCROW || ""
    }
  },

  // Testnets
  sepolia: {
    name: "Sepolia Testnet",
    chainId: 11155111,
    rpcUrl: process.env.SEPOLIA_RPC || "https://rpc.sepolia.org",
    blockTime: 12000,
    confirmations: 1,
    gasLimit: 500000,
    maxGasPrice: "20000000000",
    contractAddresses: {
      htlcEscrow: process.env.SEPOLIA_ESCROW || ""
    }
  }
};

export const getNetworkConfig = (network: string): NetworkConfig => {
  const config = NETWORKS[network];
  if (!config) {
    throw new Error(`Network ${network} not found in configuration`);
  }
  return config;
};

export const isEtherlinkNetwork = (network: string): boolean => {
  return network.startsWith('etherlink');
};

export const getSupportedNetworks = (): string[] => {
  return Object.keys(NETWORKS);
};