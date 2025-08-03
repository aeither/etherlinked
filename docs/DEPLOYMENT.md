# Deployment Guide

This guide covers deploying the Etherlink Fusion+ implementation to both Etherlink and Monad networks.

## Prerequisites

- Node.js 18+
- Hardhat
- MetaMask or compatible wallet
- Private key with sufficient funds for deployment

## Environment Setup

1. **Copy environment file:**
```bash
cp .env.example .env
```

2. **Configure environment variables:**
```bash
# Required for deployment
PRIVATE_KEY=your_private_key_here

# Optional: API keys for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key
ETHERLINK_API_KEY=your_etherlink_api_key
MONAD_API_KEY=your_monad_api_key
```

## Network Configuration

### Etherlink Networks
- **Testnet**: Chain ID 128123, RPC: `https://node.ghostnet.etherlink.com`
- **Mainnet**: Chain ID 42793, RPC: `https://node.mainnet.etherlink.com`

### Monad Networks
- **Testnet**: Chain ID 1338, RPC: `https://rpc.testnet.monad.xyz`
- **Mainnet**: Chain ID 1337, RPC: `https://rpc.monad.xyz`

## Deployment Commands

### Local Development
```bash
# Start local hardhat node
npm run node

# Deploy to local network
npm run deploy:local
```

### Etherlink Deployment
```bash
# Deploy to Etherlink testnet
npm run deploy:testnet

# Deploy to Etherlink mainnet
npm run deploy:mainnet
```

### Monad Deployment
```bash
# Deploy to Monad testnet
npm run deploy:monad-testnet

# Deploy to Monad mainnet
npm run deploy:monad-mainnet
```

## Contract Verification

After deployment, verify contracts on the respective explorers:

### Etherlink Verification
```bash
# Verify on Etherlink explorer
npx hardhat verify --network etherlinkTestnet CONTRACT_ADDRESS
npx hardhat verify --network etherlinkMainnet CONTRACT_ADDRESS
```

### Monad Verification
```bash
# Verify on Monad explorer
npx hardhat verify --network monadTestnet CONTRACT_ADDRESS
npx hardhat verify --network monadMainnet CONTRACT_ADDRESS
```

## Deployment Output

Successful deployment will create:
- `deployment-etherlink.json` - Etherlink deployment info
- `deployment-monad.json` - Monad deployment info

Example deployment output:
```json
{
  "network": "monad",
  "chainId": 1338,
  "contracts": {
    "htlcEscrow": "0x...",
    "fusionResolver": "0x..."
  },
  "deployer": "0x...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Post-Deployment Setup

1. **Authorize Resolver:**
```bash
# Set FusionResolver as authorized on HTLC contract
npx hardhat run scripts/setup-permissions.ts --network <network>
```

2. **Configure Relayer:**
Update relayer configuration with deployed contract addresses:
```typescript
// relayer/src/config/contracts.ts
export const CONTRACT_ADDRESSES = {
  etherlinkTestnet: {
    htlcEscrow: "0x...",
    fusionResolver: "0x..."
  },
  monadTestnet: {
    htlcEscrow: "0x...",
    fusionResolver: "0x..."
  }
};
```

3. **Update Frontend:**
Update frontend configuration with deployed addresses:
```typescript
// frontend/src/config/contracts.ts
export const CONTRACT_ADDRESSES = {
  etherlinkTestnet: {
    htlcEscrow: "0x...",
    fusionResolver: "0x..."
  },
  monadTestnet: {
    htlcEscrow: "0x...",
    fusionResolver: "0x..."
  }
};
```

## Testing Deployment

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
# Test on Etherlink testnet
npm run test:etherlink-testnet

# Test on Monad testnet
npm run test:monad-testnet
```

### Manual Testing
1. Connect wallet to deployed network
2. Create test HTLC escrow
3. Verify cross-chain functionality
4. Test Dutch auction mechanisms

## Troubleshooting

### Common Issues

1. **Insufficient Gas:**
   - Ensure deployer account has sufficient native tokens
   - Check gas price settings in hardhat.config.ts

2. **Contract Verification Failed:**
   - Verify API keys are correct
   - Check explorer supports contract verification
   - Ensure contract bytecode matches

3. **Network Connection Issues:**
   - Verify RPC URLs are accessible
   - Check network chain IDs
   - Ensure MetaMask is configured correctly

### Debug Commands
```bash
# Check network connection
npx hardhat console --network <network>

# Get account balance
npx hardhat run scripts/check-balance.ts --network <network>

# Verify contract deployment
npx hardhat run scripts/verify-deployment.ts --network <network>
```

## Security Considerations

1. **Private Key Security:**
   - Never commit private keys to version control
   - Use environment variables for sensitive data
   - Consider using hardware wallets for mainnet

2. **Contract Security:**
   - Audit contracts before mainnet deployment
   - Test thoroughly on testnets
   - Use multi-signature wallets for admin functions

3. **Network Security:**
   - Verify RPC endpoints are official
   - Use HTTPS connections
   - Monitor for suspicious activity

## Monitoring

### Contract Events
Monitor these events for operational health:
- `FusionEscrowCreated`
- `FusionEscrowWithdrawn`
- `FusionEscrowCancelled`
- `DutchAuctionUpdate`

### Network Metrics
- Transaction success rate
- Gas usage patterns
- Cross-chain swap completion rates
- Dutch auction performance

## Support

For deployment issues:
1. Check network status pages
2. Review contract documentation
3. Test on testnets first
4. Contact network support teams