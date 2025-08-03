
<div align="center">
    <img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/6b2e5a03-7422-447a-a650-9d2345792edc" />
</div>

# Etherlink & Monad Fusion+ Implementation

## 🎯 Project Overview

This project implements 1inch Fusion+ protocol support for both **Etherlink** and **Monad**, enabling gasless cross-chain swaps with MEV protection through high-performance EVM-compatible Layer 1 and Layer 2 networks.

## 🔧 Architecture

### Architecture Overview

┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend UI   │────│  Relayer Service │────│ Smart Contracts │
│   React/Viem    │    │  Cross-chain     │    │ HTLC Escrows    │
│   Real-time UX  │    │  Event Monitor   │    │ Dutch Auctions  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                    ┌─────────────────────────┐
                    │     1inch Fusion+       │
                    │   Dutch Auction API     │
                    │   Resolver Network      │
                    └─────────────────────────┘

### Core Components

1. **HTLC Escrow Contracts** (`/contracts`)
   - Hash Time-Locked Contract implementation for Etherlink and Monad
   - Cross-chain atomic swap guarantees
   - Support for native tokens (XTZ, MONAD) and ERC20 tokens
   - Optimized for sub-500ms confirmation times

2. **Relayer Service** (`/relayer`)
   - Cross-chain communication between Etherlink, Monad, and other chains
   - Event monitoring and secret revelation
   - Automated swap execution and settlement

3. **Frontend Interface** (`/frontend`)
   - User-friendly interface for Fusion+ swaps
   - Multi-chain wallet integration
   - Real-time swap status monitoring

## 🌟 Key Features

- **Gasless Swaps**: Users don't pay gas fees - resolvers handle all costs
- **MEV Protection**: Built-in sandwich attack prevention
- **Multi-Chain Support**: Seamless swaps between Etherlink, Monad, and other EVM chains
- **Ultra-Fast Finality**: Leveraging Etherlink's 500ms and Monad's high-performance confirmations
- **Decentralized**: No admin keys, fully trustless atomic swaps

## 🚀 1inch Fusion+ Integration

### Dutch Auction Mechanism
- Resolvers compete to fill orders with progressively better rates
- Orders start with favorable rates and improve over time
- First resolver to commit wins the auction

### Phases Implementation
1. **Announcement Phase**: Order broadcast and Dutch auction initiation
2. **Deposit Phase**: HTLC escrow creation on both chains
3. **Withdrawal Phase**: Secret revelation and asset unlocking
4. **Recovery Phase**: Timeout handling and emergency recovery

## 🔗 Network Integration

### Etherlink Integration
- **Mainnet**: `https://node.mainnet.etherlink.com`
- **Testnet**: `https://node.ghostnet.etherlink.com`
- **Chain ID**: 42793 (mainnet), 128123 (testnet)
- **Native Token**: XTZ (bridged from Tezos)

### Monad Integration
- **Mainnet**: `https://rpc.monad.xyz`
- **Testnet**: `https://rpc.testnet.monad.xyz`
- **Chain ID**: 1337 (mainnet), 1338 (testnet)
- **Native Token**: MONAD

### Unique Advantages
- **Etherlink**: Ultra-fast 500ms confirmation times, low fees, Tezos-enshrined rollup
- **Monad**: High-performance Layer 1, parallel execution, institutional-grade security

## 📁 Project Structure

```
etherlink-fusion-plus/
├── contracts/              # Smart contracts
│   ├── HTLCEtherlinkEscrow.sol      # Core HTLC implementation
│   ├── FusionResolver.sol  # Resolver logic
│   ├── scripts/
│   │   ├── deploy.ts       # Etherlink deployment
│   │   └── deploy-monad.ts # Monad deployment
│   └── hardhat.config.ts   # Multi-network configuration
├── relayer/                # Off-chain relayer service
│   ├── src/
│   │   ├── services/
│   │   │   ├── EtherlinkService.ts  # Etherlink integration
│   │   │   ├── MonadService.ts      # Monad integration
│   │   │   ├── FusionService.ts     # 1inch Fusion+ client
│   │   │   └── RelayerService.ts    # Cross-chain orchestration
│   │   └── config/
│   │       └── networks.ts # Multi-network configuration
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── config/
│   │   │   └── networks.ts # Multi-network support
│   │   └── utils/          # Utilities
│   └── package.json
└── docs/                   # Documentation
    ├── architecture.md     # Technical architecture
    ├── deployment.md       # Deployment guide
    └── demo.md            # Demo instructions
```

## 🛠 Development Setup

### Prerequisites
- Node.js 18+
- TypeScript
- Hardhat/Foundry
- MetaMask or compatible wallet

### Installation
```bash
# Clone and setup
git clone <repo-url>
cd etherlink-fusion-plus

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration
```

### Local Development
```bash
# Start local hardhat node
npm run node

# Deploy contracts to local network
npm run deploy:local

# Start relayer
npm run relayer:dev

# Start frontend
npm run frontend:dev
```

## 🧪 Testing

### Unit Tests
```bash
npm run test:contracts
npm run test:relayer
npm run test:frontend
```

### Integration Tests
```bash
npm run test:e2e
```

### Deployment Tests
```bash
# Deploy to Etherlink testnet
npm run deploy:testnet

# Deploy to Monad testnet
npm run deploy:monad-testnet

# Run integration tests
npm run test:testnet
```

## 🚀 Deployment

### Etherlink Networks
```bash
# Etherlink testnet
npm run deploy:testnet

# Etherlink mainnet
npm run deploy:mainnet
```

### Monad Networks
```bash
# Monad testnet
npm run deploy:monad-testnet

# Monad mainnet
npm run deploy:monad-mainnet
```

## 📊 Demo & Presentation

### Live Demo Features
1. Connect MetaMask to Etherlink or Monad
2. Initiate cross-chain swap via Fusion+
3. Monitor Dutch auction progress
4. Observe atomic settlement
5. Verify MEV protection

### Supported Networks
- **Etherlink**: Ultra-fast Layer 2 with 500ms finality
- **Monad**: High-performance Layer 1 with parallel execution
- **Ethereum**: Mainnet and Sepolia testnet
- **Arbitrum**: Layer 2 scaling solution
- **Optimism**: Layer 2 with optimistic rollups
- **Polygon**: Layer 2 with sidechains

## 🔄 Cross-Chain Swaps

### Supported Swap Pairs
- **Etherlink ↔ Monad**: Native XTZ ↔ MONAD swaps
- **Etherlink ↔ Ethereum**: XTZ ↔ ETH/USDC/DAI
- **Monad ↔ Ethereum**: MONAD ↔ ETH/USDC/DAI
- **Multi-chain**: Any combination of supported networks

### Performance Characteristics
- **Etherlink**: 500ms confirmation, <$0.001 fees
- **Monad**: High TPS, parallel execution, low latency
- **Cross-chain**: Atomic swaps with MEV protection
