import { Network } from '../types';

export const SUPPORTED_NETWORKS: Record<string, Network> = {
  etherlinkMainnet: {
    id: 42793,
    name: 'Etherlink',
    symbol: 'XTZ',
    rpcUrl: 'https://node.mainnet.etherlink.com',
    explorer: 'https://explorer.etherlink.com',
    logo: '/images/etherlink-logo.svg',
    isTestnet: false
  },
  etherlinkTestnet: {
    id: 128123,
    name: 'Etherlink Testnet',
    symbol: 'XTZ',
    rpcUrl: 'https://node.ghostnet.etherlink.com',
    explorer: 'https://explorer.ghostnet.etherlink.com',
    logo: '/images/etherlink-logo.svg',
    isTestnet: true
  },
  monadMainnet: {
    id: 1337,
    name: 'Monad',
    symbol: 'MONAD',
    rpcUrl: 'https://rpc.monad.xyz',
    explorer: 'https://explorer.monad.xyz',
    logo: '/images/monad-logo.svg',
    isTestnet: false
  },
  monadTestnet: {
    id: 1338,
    name: 'Monad Testnet',
    symbol: 'MONAD',
    rpcUrl: 'https://rpc.testnet.monad.xyz',
    explorer: 'https://explorer.testnet.monad.xyz',
    logo: '/images/monad-logo.svg',
    isTestnet: true
  },
  ethereum: {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    logo: '/images/ethereum-logo.svg',
    isTestnet: false
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
    logo: '/images/arbitrum-logo.svg',
    isTestnet: false
  },
  optimism: {
    id: 10,
    name: 'Optimism',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io',
    explorer: 'https://optimistic.etherscan.io',
    logo: '/images/optimism-logo.svg',
    isTestnet: false
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    logo: '/images/polygon-logo.svg',
    isTestnet: false
  },
  sepolia: {
    id: 11155111,
    name: 'Sepolia',
    symbol: 'ETH',
    rpcUrl: 'https://rpc.sepolia.org',
    explorer: 'https://sepolia.etherscan.io',
    logo: '/images/ethereum-logo.svg',
    isTestnet: true
  }
};

export const getNetworkById = (chainId: number): Network | undefined => {
  return Object.values(SUPPORTED_NETWORKS).find(network => network.id === chainId);
};

export const getNetworkByName = (name: string): Network | undefined => {
  return Object.values(SUPPORTED_NETWORKS).find(network => network.name.toLowerCase() === name.toLowerCase());
};