# 🚀 Deployment Guide

## 📋 Prerequisites

### System Requirements
- Node.js 18.0+
- npm or yarn
- Git
- MetaMask or compatible Web3 wallet

### Required Accounts & Keys
- Etherlink testnet account with XTZ
- Ethereum Sepolia account with ETH
- Private key for contract deployment
- (Optional) 1inch API key for production

## 🏗️ Smart Contract Deployment

### 1. Environment Setup

```bash
# Clone repository
git clone <repository-url>
cd etherlink-fusion-plus

# Install dependencies
npm install

# Setup environment variables
cp contracts/.env.example contracts/.env
```

### 2. Configure Environment

Edit `contracts/.env`:
```bash
PRIVATE_KEY=your_private_key_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key_optional
VERIFY_CONTRACTS=true
```

### 3. Deploy to Etherlink Testnet

```bash
cd contracts

# Compile contracts
npm run compile

# Deploy to Etherlink testnet
npm run deploy:testnet

# Expected output:
# ✅ HTLCEtherlinkEscrow deployed to: 0x123...
# ✅ FusionResolver deployed to: 0x456...
# ✅ Resolver authorized in escrow contract
```

### 4. Deploy to Other Networks (Optional)

```bash
# Deploy to Ethereum Sepolia
npm run deploy:sepolia

# Deploy to Arbitrum testnet
npm run deploy:arbitrum-testnet
```

### 5. Verify Contracts

```bash
# Verify on block explorer
npm run verify -- --network etherlinkTestnet 0x123... "constructor_args"
```

## 🔗 Relayer Service Deployment

### 1. Configure Relayer

```bash
cd relayer

# Setup environment
cp .env.example .env
```

Edit `relayer/.env`:
```bash
PRIVATE_KEY=your_relayer_private_key
NETWORKS=etherlinkTestnet,sepolia
ETHERLINK_TESTNET_ESCROW=0x123...
ETHERLINK_TESTNET_RESOLVER=0x456...
SEPOLIA_ESCROW=0x789...
```

### 2. Local Development

```bash
# Install dependencies
npm install

# Start relayer in development mode
npm run dev

# Expected output:
# 📡 Relayer with viem started...
# ✅ Escuchando eventos SecretRevealed...
# 🌐 Server running on http://localhost:3001
```

### 3. Production Deployment

#### Option A: PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Build relayer
npm run build

# Start with PM2
pm2 start dist/index.js --name "etherlink-relayer"

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Option B: Docker
```bash
# Build Docker image
docker build -t etherlink-relayer .

# Run container
docker run -d \
  --name etherlink-relayer \
  --env-file .env \
  -p 3001:3001 \
  etherlink-relayer
```

#### Option C: Cloud Deployment (Heroku/Railway/Render)
```bash
# Add buildpacks
heroku buildpacks:add heroku/nodejs

# Set environment variables
heroku config:set PRIVATE_KEY=your_key
heroku config:set NETWORKS=etherlinkTestnet,sepolia

# Deploy
git push heroku main
```

### 4. Health Check

```bash
# Test relayer health
curl http://localhost:3001/health

# Expected response:
{
  "status": "ok",
  "timestamp": 1703123456789,
  "relayer": {
    "isRunning": true,
    "networks": ["etherlinkTestnet", "sepolia"],
    "activeOrders": 0,
    "pendingSwaps": 0
  }
}
```

## 🌐 Frontend Deployment

### 1. Configure Frontend

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
```

Edit `frontend/.env`:
```bash
VITE_RELAYER_URL=http://localhost:3001
VITE_ETHERLINK_RPC=https://node.ghostnet.etherlink.com
VITE_ESCROW_CONTRACT=0x123...
VITE_RESOLVER_CONTRACT=0x456...
```

### 2. Build Frontend

```bash
# Build for production
npm run build

# Preview build locally
npm run preview
```

### 3. Deploy Options

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

#### Option B: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Option C: Static Hosting
```bash
# Upload dist/ folder to:
# - AWS S3 + CloudFront
# - GitHub Pages
# - Firebase Hosting
# - IPFS
```

### 4. Custom Domain (Optional)

```bash
# Add custom domain in hosting provider
# Example: etherlink-fusion.vercel.app → fusion.yourdomain.com

# Update CORS settings in relayer
CORS_ORIGIN=https://fusion.yourdomain.com
```

## 🔐 Security Configuration

### 1. Private Key Management

**Development**:
```bash
# Use test private keys only
PRIVATE_KEY=0x123...testkey...
```

**Production**:
```bash
# Use environment variables or secret management
# AWS Secrets Manager, HashiCorp Vault, etc.
export PRIVATE_KEY=$(aws secretsmanager get-secret-value --secret-id prod/relayer/private-key --query SecretString --output text)
```

### 2. API Security

```bash
# Enable CORS restrictions
CORS_ORIGIN=https://yourdomain.com

# Add rate limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX=100

# Add authentication (optional)
API_KEY_REQUIRED=true
API_KEY=your_secret_api_key
```

### 3. Network Security

```bash
# Use WSS for WebSocket connections
WSS_ENABLED=true

# Enable SSL/TLS
SSL_ENABLED=true
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
```

## 📊 Monitoring & Logging

### 1. Application Monitoring

```bash
# Add monitoring service
npm install @sentry/node

# Configure in relayer
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info
```

### 2. Infrastructure Monitoring

```bash
# PM2 monitoring
pm2 monit

# Docker monitoring
docker stats etherlink-relayer

# System monitoring
htop
```

### 3. Logging

```bash
# Configure log rotation
npm install winston-daily-rotate-file

# View logs
tail -f logs/combined.log
tail -f logs/error.log
```

## 🧪 Testing Deployment

### 1. Contract Tests

```bash
cd contracts

# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Test gas usage
npm run test:gas
```

### 2. Relayer Tests

```bash
cd relayer

# Test relayer service
npm test

# Test network connectivity
npm run test:networks

# Test event monitoring
npm run test:events
```

### 3. End-to-End Tests

```bash
# Test complete swap flow
npm run test:e2e

# Test error scenarios
npm run test:recovery

# Load testing
npm run test:load
```

## 🔄 Updates & Maintenance

### 1. Contract Upgrades

```bash
# Deploy new version
npm run deploy:upgrade

# Verify upgrade
npm run verify:upgrade
```

### 2. Relayer Updates

```bash
# Update dependencies
npm update

# Restart service
pm2 restart etherlink-relayer

# Zero-downtime deployment
pm2 reload etherlink-relayer
```

### 3. Frontend Updates

```bash
# Build new version
npm run build

# Deploy to production
vercel --prod
```

## 📈 Scaling Considerations

### 1. High Availability

```bash
# Deploy multiple relayer instances
pm2 start ecosystem.config.js

# Load balancer configuration
# Nginx, HAProxy, or cloud load balancer
```

### 2. Database Scaling

```bash
# Add Redis for caching
REDIS_URL=redis://localhost:6379

# PostgreSQL for transaction history
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### 3. Network Optimization

```bash
# Use dedicated RPC endpoints
ETHERLINK_RPC=https://premium-etherlink-rpc.com
ETHEREUM_RPC=https://premium-ethereum-rpc.com

# Enable connection pooling
RPC_POOL_SIZE=10
```

## 🚨 Troubleshooting

### Common Issues

**Contract deployment fails**:
```bash
# Check account balance
# Verify network configuration
# Increase gas limit
```

**Relayer not processing events**:
```bash
# Check RPC connectivity
# Verify contract addresses
# Restart relayer service
```

**Frontend not connecting**:
```bash
# Check CORS settings
# Verify relayer URL
# Check MetaMask network
```

### Debug Commands

```bash
# Check contract state
npm run debug:contracts

# Monitor relayer logs
npm run debug:relayer

# Test network connectivity
npm run debug:networks
```

---

## 🎉 Deployment Complete!

Your Etherlink Fusion+ implementation is now live! 

**Next Steps**:
1. Monitor initial transactions
2. Gather user feedback  
3. Optimize performance
4. Plan mainnet deployment

**Support**: For deployment issues, check the troubleshooting section or contact the development team.