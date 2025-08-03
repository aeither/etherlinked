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

export const DEFAULT_TOKENS = {
  // Etherlink tokens
  42793: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'XTZ',
      name: 'Tezos',
      decimals: 18,
      chainId: 42793,
      logoUri: '/images/tezos-logo.svg'
    }
  ],
  128123: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'XTZ',
      name: 'Tezos',
      decimals: 18,
      chainId: 128123,
      logoUri: '/images/tezos-logo.svg'
    }
  ],
  // Ethereum tokens
  1: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      chainId: 1,
      logoUri: '/images/ethereum-logo.svg'
    },
    {
      address: '0xA0b86a33E6441d07B8dB3C3512Bbc6C8cE3C9D26',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      chainId: 1,
      logoUri: '/images/usdc-logo.svg'
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      chainId: 1,
      logoUri: '/images/usdt-logo.svg'
    }
  ],
  // Arbitrum tokens
  42161: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      chainId: 42161,
      logoUri: '/images/ethereum-logo.svg'
    },
    {
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      chainId: 42161,
      logoUri: '/images/usdc-logo.svg'
    }
  ],
  // Add more tokens as needed
};

export const getNetworkById = (chainId: number): Network | undefined => {
  return Object.values(SUPPORTED_NETWORKS).find(network => network.id === chainId);
};

export const getTokensByChainId = (chainId: number) => {
  return DEFAULT_TOKENS[chainId as keyof typeof DEFAULT_TOKENS] || [];
};