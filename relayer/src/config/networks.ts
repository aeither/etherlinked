import { Network, NetworkConfig } from '../types';

export const SUPPORTED_NETWORKS: Record<string, Network> = {
  etherlinkMainnet: {
    name: 'Etherlink',
    chainId: 42793,
    rpcUrl: 'https://node.mainnet.etherlink.com',
    nativeCurrency: {
      name: 'Tezos',
      symbol: 'XTZ',
      decimals: 18
    },
    blockExplorer: 'https://explorer.etherlink.com'
  },
  etherlinkTestnet: {
    name: 'Etherlink Testnet',
    chainId: 128123,
    rpcUrl: 'https://node.ghostnet.etherlink.com',
    nativeCurrency: {
      name: 'Tezos',
      symbol: 'XTZ',
      decimals: 18
    },
    blockExplorer: 'https://explorer.ghostnet.etherlink.com'
  },
  monadMainnet: {
    name: 'Monad',
    chainId: 1337,
    rpcUrl: 'https://rpc.monad.xyz',
    nativeCurrency: {
      name: 'Monad',
      symbol: 'MONAD',
      decimals: 18
    },
    blockExplorer: 'https://explorer.monad.xyz'
  },
  monadTestnet: {
    name: 'Monad Testnet',
    chainId: 1338,
    rpcUrl: 'https://rpc.testnet.monad.xyz',
    nativeCurrency: {
      name: 'Monad',
      symbol: 'MONAD',
      decimals: 18
    },
    blockExplorer: 'https://explorer.testnet.monad.xyz'
  },
  ethereum: {
    name: 'Ethereum',
    chainId: 1,
    rpcUrl: 'https://eth.llamarpc.com',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorer: 'https://etherscan.io'
  },
  arbitrum: {
    name: 'Arbitrum',
    chainId: 42161,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorer: 'https://arbiscan.io'
  },
  optimism: {
    name: 'Optimism',
    chainId: 10,
    rpcUrl: 'https://mainnet.optimism.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorer: 'https://optimistic.etherscan.io'
  },
  polygon: {
    name: 'Polygon',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    blockExplorer: 'https://polygonscan.com'
  },
  sepolia: {
    name: 'Sepolia',
    chainId: 11155111,
    rpcUrl: 'https://rpc.sepolia.org',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorer: 'https://sepolia.etherscan.io'
  }
};

export const getNetworkById = (chainId: number): Network | undefined => {
  return Object.values(SUPPORTED_NETWORKS).find(network => network.chainId === chainId);
};

export const getNetworkByName = (name: string): Network | undefined => {
  return Object.values(SUPPORTED_NETWORKS).find(network => network.name.toLowerCase() === name.toLowerCase());
};