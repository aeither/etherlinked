
<div align="center">
    <img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/6b2e5a03-7422-447a-a650-9d2345792edc" />
</div>

# Etherlink Fusion+ Implementation

## 🎯 Project Overview

This project implements 1inch Fusion+ protocol support for Etherlink, enabling gasless cross-chain swaps with MEV protection through Etherlink's high-performance EVM-compatible Layer 2.

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
   - Hash Time-Locked Contract implementation for Etherlink
   - Cross-chain atomic swap guarantees
   - Support for both native XTZ and ERC20 tokens
   - Optimized for Etherlink's sub-500ms confirmation times

2. **Relayer Service** (`/relayer`)
   - Cross-chain communication between Etherlink and other chains
   - Event monitoring and secret revelation
   - Automated swap execution and settlement

3. **Frontend Interface** (`/frontend`)
   - User-friendly interface for Fusion+ swaps
   - Etherlink wallet integration
   - Real-time swap status monitoring

## 🌟 Key Features

- **Gasless Swaps**: Users don't pay gas fees - resolvers handle all costs
- **MEV Protection**: Built-in sandwich attack prevention
- **Cross-Chain**: Seamless swaps between Etherlink and other EVM chains
- **Sub-Second Finality**: Leveraging Etherlink's 500ms confirmation times
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

## 🔗 Etherlink Integration

### Network Configuration
- **Mainnet**: `https://node.mainnet.etherlink.com`
- **Testnet**: `https://node.ghostnet.etherlink.com`
- **Chain ID**: TBD based on deployment
- **Native Token**: XTZ (bridged from Tezos)

### Unique Etherlink Advantages
- **Ultra-fast**: 500ms confirmation times vs 2s+ on other L2s
- **Low Fees**: <$0.001 per transaction
- **Fully Decentralized**: Tezos-enshrined rollup technology
- **Upgradeable**: On-chain governance for protocol evolution

## 📁 Project Structure

```
etherlink-fusion-plus/
├── contracts/              # Smart contracts
│   ├── HTLCEscrow.sol      # Core HTLC implementation
│   ├── FusionResolver.sol  # Resolver logic
│   └── deploy/             # Deployment scripts
├── relayer/                # Off-chain relayer service
│   ├── src/
│   │   ├── etherlink.ts    # Etherlink integration
│   │   ├── fusion.ts       # 1inch Fusion+ client
│   │   └── htlc.ts         # HTLC management
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Web3 hooks
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

# Deploy contracts
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

# Run integration tests
npm run test:testnet
```

## 🚀 Deployment

### Etherlink Testnet
```bash
npm run deploy:testnet
```

### Etherlink Mainnet
```bash
npm run deploy:mainnet
```

## 📊 Demo & Presentation

### Live Demo Features
1. Connect MetaMask to Etherlink
2. Initiate cross-chain swap via Fusion+
3. Monitor Dutch auction progress
4. Observe atomic settlement
5. Verify MEV protection

<div align="center">
    <img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/572d4eaa-c8b9-41e1-beaf-567b2184bd0e" />
</div>
