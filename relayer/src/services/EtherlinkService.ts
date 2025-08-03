/**
 * Etherlink network service for Fusion+ integration
 * Handles Etherlink-specific operations and optimizations
 */

import { createPublicClient, createWalletClient, http, parseAbi, getContract, Address, Hash, Log } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { defineChain } from 'viem';
import { NetworkConfig } from '../config/networks';
import { FusionOrder, EscrowEvent, EscrowEventType } from '../types/fusion';
import { Logger } from '../utils/logger';

// Define Etherlink chains for viem
const etherlinkMainnet = defineChain({
  id: 42793,
  name: 'Etherlink Mainnet',
  network: 'etherlink',
  nativeCurrency: {
    decimals: 18,
    name: 'XTZ',
    symbol: 'XTZ',
  },
  rpcUrls: {
    default: {
      http: ['https://node.mainnet.etherlink.com'],
    },
    public: {
      http: ['https://node.mainnet.etherlink.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Etherlink Explorer', url: 'https://explorer.etherlink.com' },
  },
});

const etherlinkTestnet = defineChain({
  id: 128123,
  name: 'Etherlink Testnet',
  network: 'etherlink-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'XTZ',
    symbol: 'XTZ',
  },
  rpcUrls: {
    default: {
      http: ['https://node.ghostnet.etherlink.com'],
    },
    public: {
      http: ['https://node.ghostnet.etherlink.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Etherlink Testnet Explorer', url: 'https://explorer.ghostnet.etherlink.com' },
  },
});

const HTLC_ESCROW_ABI = parseAbi([
  'event FusionEscrowCreated(bytes32 indexed escrowId, string indexed orderId, address indexed sender, address receiver, address resolver, uint256 amount, bytes32 secretHash, uint256 timelock, address tokenAddress, uint256 startRate, uint256 endRate)',
  'event FusionEscrowWithdrawn(bytes32 indexed escrowId, string indexed orderId, address indexed receiver, bytes32 secret, uint256 executionRate)',
  'event FusionEscrowCancelled(bytes32 indexed escrowId, string indexed orderId, address indexed sender, uint256 refundAmount)',
  'event DutchAuctionUpdate(string indexed orderId, uint256 currentRate)',
  'function getCurrentAuctionRate(string memory orderId) external view returns (uint256)',
  'function getEscrow(bytes32 escrowId) external view returns (tuple(address sender, address receiver, address resolver, uint256 amount, bytes32 secretHash, uint256 timelock, bool withdrawn, bool cancelled, address tokenAddress, string orderId, uint256 createdAt, uint256 auctionStartTime, uint256 auctionEndTime, uint256 startRate, uint256 endRate, bool isResolverEscrow))',
  'function createFusionEscrowNative(bytes32 secretHash, uint256 timelockSeconds, address payable receiver, address payable resolver, string memory orderId, uint256 auctionDuration, uint256 startRate, uint256 endRate) external payable returns (bytes32)',
  'function withdraw(bytes32 escrowId, string memory secret) external',
  'function cancel(bytes32 escrowId) external'
]);

export class EtherlinkService {
  private publicClient: any;
  private walletClient: any;
  private account: any;
  private escrowContract: any;
  private logger: Logger;
  private networkConfig: NetworkConfig;
  private isTestnet: boolean;

  constructor(
    networkConfig: NetworkConfig,
    privateKey: string,
    logger: Logger
  ) {
    this.networkConfig = networkConfig;
    this.logger = logger;
    this.isTestnet = networkConfig.chainId === 128123;
    
    // Setup account
    this.account = privateKeyToAccount(privateKey as Hash);
    
    // Setup clients
    const chain = this.isTestnet ? etherlinkTestnet : etherlinkMainnet;
    
    this.publicClient = createPublicClient({
      chain,
      transport: http(networkConfig.rpcUrl)
    });

    this.walletClient = createWalletClient({
      account: this.account,
      chain,
      transport: http(networkConfig.rpcUrl)
    });

    // Setup contract instance
    if (networkConfig.contractAddresses.htlcEscrow) {
      this.escrowContract = getContract({
        address: networkConfig.contractAddresses.htlcEscrow as Address,
        abi: HTLC_ESCROW_ABI,
        publicClient: this.publicClient,
        walletClient: this.walletClient
      });
    }

    this.logger.info(`EtherlinkService initialized for ${networkConfig.name}`, {
      chainId: networkConfig.chainId,
      account: this.account.address,
      escrowContract: networkConfig.contractAddresses.htlcEscrow
    });
  }

  /**
   * Start monitoring escrow events on Etherlink
   * Leverages Etherlink's 500ms confirmation for real-time monitoring
   */
  async startEventMonitoring(callback: (event: EscrowEvent) => void): Promise<void> {
    if (!this.escrowContract) {
      throw new Error('Escrow contract not configured');
    }

    this.logger.info('Starting event monitoring on Etherlink...');

    // Monitor FusionEscrowCreated events
    this.publicClient.watchEvent({
      address: this.escrowContract.address,
      event: parseAbi(['event FusionEscrowCreated(bytes32 indexed escrowId, string indexed orderId, address indexed sender, address receiver, address resolver, uint256 amount, bytes32 secretHash, uint256 timelock, address tokenAddress, uint256 startRate, uint256 endRate)'])[0],
      onLogs: (logs: Log[]) => {
        logs.forEach(log => {
          const event: EscrowEvent = {
            eventType: EscrowEventType.ESCROW_CREATED,
            escrowId: log.args.escrowId as string,
            orderId: log.args.orderId as string,
            blockNumber: Number(log.blockNumber),
            transactionHash: log.transactionHash,
            timestamp: Date.now(),
            data: log.args
          };
          callback(event);
        });
      }
    });

    // Monitor FusionEscrowWithdrawn events (secret reveals)
    this.publicClient.watchEvent({
      address: this.escrowContract.address,
      event: parseAbi(['event FusionEscrowWithdrawn(bytes32 indexed escrowId, string indexed orderId, address indexed receiver, bytes32 secret, uint256 executionRate)'])[0],
      onLogs: (logs: Log[]) => {
        logs.forEach(log => {
          const event: EscrowEvent = {
            eventType: EscrowEventType.ESCROW_WITHDRAWN,
            escrowId: log.args.escrowId as string,
            orderId: log.args.orderId as string,
            blockNumber: Number(log.blockNumber),
            transactionHash: log.transactionHash,
            timestamp: Date.now(),
            data: log.args
          };
          callback(event);
        });
      }
    });

    // Monitor cancellation events
    this.publicClient.watchEvent({
      address: this.escrowContract.address,
      event: parseAbi(['event FusionEscrowCancelled(bytes32 indexed escrowId, string indexed orderId, address indexed sender, uint256 refundAmount)'])[0],
      onLogs: (logs: Log[]) => {
        logs.forEach(log => {
          const event: EscrowEvent = {
            eventType: EscrowEventType.ESCROW_CANCELLED,
            escrowId: log.args.escrowId as string,
            orderId: log.args.orderId as string,
            blockNumber: Number(log.blockNumber),
            transactionHash: log.transactionHash,
            timestamp: Date.now(),
            data: log.args
          };
          callback(event);
        });
      }
    });

    this.logger.info('Event monitoring started successfully');
  }

  /**
   * Create escrow on Etherlink for cross-chain swap
   */
  async createEscrow(
    secretHash: string,
    timelockSeconds: number,
    receiver: string,
    resolver: string,
    orderId: string,
    auctionDuration: number,
    startRate: bigint,
    endRate: bigint,
    amount: bigint
  ): Promise<string> {
    try {
      this.logger.info(`Creating escrow on Etherlink for order ${orderId}`, {
        amount: amount.toString(),
        receiver,
        resolver,
        timelockSeconds
      });

      const hash = await this.escrowContract.write.createFusionEscrowNative([
        secretHash as Hash,
        BigInt(timelockSeconds),
        receiver as Address,
        resolver as Address,
        orderId,
        BigInt(auctionDuration),
        startRate,
        endRate
      ], {
        value: amount,
        gas: this.networkConfig.gasLimit
      });

      this.logger.info(`Escrow creation transaction sent: ${hash}`);
      
      // Wait for confirmation (fast on Etherlink)
      const receipt = await this.publicClient.waitForTransactionReceipt({ 
        hash,
        confirmations: this.networkConfig.confirmations
      });

      this.logger.info(`Escrow created successfully in block ${receipt.blockNumber}`);
      return hash;

    } catch (error) {
      this.logger.error(`Failed to create escrow: ${error}`);
      throw error;
    }
  }

  /**
   * Withdraw from escrow using revealed secret
   */
  async withdrawEscrow(escrowId: string, secret: string): Promise<string> {
    try {
      this.logger.info(`Withdrawing from escrow ${escrowId} with secret`);

      const hash = await this.escrowContract.write.withdraw([
        escrowId as Hash,
        secret
      ], {
        gas: 300000
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({ 
        hash,
        confirmations: this.networkConfig.confirmations
      });

      this.logger.info(`Escrow withdrawal successful: ${hash}`);
      return hash;

    } catch (error) {
      this.logger.error(`Failed to withdraw escrow: ${error}`);
      throw error;
    }
  }

  /**
   * Get current Dutch auction rate for an order
   * Utilizes Etherlink's fast finality for real-time rates
   */
  async getCurrentRate(orderId: string): Promise<bigint> {
    try {
      const rate = await this.escrowContract.read.getCurrentAuctionRate([orderId]);
      return rate as bigint;
    } catch (error) {
      this.logger.error(`Failed to get current rate for order ${orderId}: ${error}`);
      throw error;
    }
  }

  /**
   * Get escrow details
   */
  async getEscrowDetails(escrowId: string): Promise<any> {
    try {
      const details = await this.escrowContract.read.getEscrow([escrowId as Hash]);
      return details;
    } catch (error) {
      this.logger.error(`Failed to get escrow details: ${error}`);
      throw error;
    }
  }

  /**
   * Cancel expired escrow
   */
  async cancelEscrow(escrowId: string): Promise<string> {
    try {
      this.logger.info(`Cancelling expired escrow ${escrowId}`);

      const hash = await this.escrowContract.write.cancel([
        escrowId as Hash
      ], {
        gas: 200000
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({ 
        hash,
        confirmations: this.networkConfig.confirmations
      });

      this.logger.info(`Escrow cancelled successfully: ${hash}`);
      return hash;

    } catch (error) {
      this.logger.error(`Failed to cancel escrow: ${error}`);
      throw error;
    }
  }

  /**
   * Get account balance (for resolver operations)
   */
  async getBalance(): Promise<bigint> {
    try {
      const balance = await this.publicClient.getBalance({
        address: this.account.address
      });
      return balance;
    } catch (error) {
      this.logger.error(`Failed to get balance: ${error}`);
      throw error;
    }
  }

  /**
   * Get latest block number
   */
  async getLatestBlock(): Promise<number> {
    try {
      const block = await this.publicClient.getBlock({ blockTag: 'latest' });
      return Number(block.number);
    } catch (error) {
      this.logger.error(`Failed to get latest block: ${error}`);
      throw error;
    }
  }

  /**
   * Estimate gas for operation
   */
  async estimateGas(to: string, data: string, value?: bigint): Promise<bigint> {
    try {
      const gas = await this.publicClient.estimateGas({
        account: this.account.address,
        to: to as Address,
        data: data as Hash,
        value: value || 0n
      });
      return gas;
    } catch (error) {
      this.logger.error(`Failed to estimate gas: ${error}`);
      throw error;
    }
  }

  /**
   * Check if connected and healthy
   */
  async isHealthy(): Promise<boolean> {
    try {
      await this.publicClient.getChainId();
      return true;
    } catch (error) {
      this.logger.error(`Health check failed: ${error}`);
      return false;
    }
  }
}