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
    id: 1337, // Monad mainnet chain ID
    name: 'Monad',
    symbol: 'MONAD',
    rpcUrl: 'https://rpc.monad.xyz',
    explorer: 'https://explorer.monad.xyz',
    logo: '/images/monad-logo.svg',
    isTestnet: false
  },
  monadTestnet: {
    id: 1338, // Monad testnet chain ID
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
  // Monad tokens
  1337: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'MONAD',
      name: 'Monad',
      decimals: 18,
      chainId: 1337,
      logoUri: '/images/monad-logo.svg'
    }
  ],
  1338: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'MONAD',
      name: 'Monad',
      decimals: 18,
      chainId: 1338,
      logoUri: '/images/monad-logo.svg'
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
      address: '0xA0b86a33E6441b8c4C8C3C8C3C8C3C8C3C8C3C8C',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      chainId: 1,
      logoUri: '/images/usdc-logo.svg'
    },
    {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
      chainId: 1,
      logoUri: '/images/dai-logo.svg'
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
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      chainId: 42161,
      logoUri: '/images/usdc-logo.svg'
    }
  ],
  // Optimism tokens
  10: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      chainId: 10,
      logoUri: '/images/ethereum-logo.svg'
    },
    {
      address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      chainId: 10,
      logoUri: '/images/usdc-logo.svg'
    }
  ],
  // Polygon tokens
  137: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'MATIC',
      name: 'Polygon',
      decimals: 18,
      chainId: 137,
      logoUri: '/images/polygon-logo.svg'
    },
    {
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      chainId: 137,
      logoUri: '/images/usdc-logo.svg'
    }
  ],
  // Sepolia testnet
  11155111: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      chainId: 11155111,
      logoUri: '/images/ethereum-logo.svg'
    }
  ]
};

export const getNetworkById = (chainId: number): Network | undefined => {
  return Object.values(SUPPORTED_NETWORKS).find(network => network.id === chainId);
};

export const getTokensByChainId = (chainId: number) => {
  return DEFAULT_TOKENS[chainId] || [];
};