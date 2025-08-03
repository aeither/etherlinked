/**
 * Main relayer service orchestrating cross-chain Fusion+ swaps
 */

import { EventEmitter } from 'events';
import { EtherlinkService } from './EtherlinkService';
import { MonadService } from './MonadService';
import { FusionService } from './FusionService';
import { SUPPORTED_NETWORKS } from '../config/networks';
import { 
  FusionOrder, 
  CrossChainSwap, 
  EscrowEvent, 
  EscrowEventType,
  CrossChainSwapStatus,
  FusionOrderStatus,
  RelayerState,
  RelayerError
} from '../types/fusion';
import { Logger } from '../utils/logger';

export class RelayerService extends EventEmitter {
  private logger: Logger;
  private networkServices: Map<string, EtherlinkService | MonadService> = new Map();
  private fusionService: FusionService;
  private pendingSwaps: Map<string, CrossChainSwap> = new Map();
  private activeOrders: Map<string, FusionOrder> = new Map();
  private isRunning: boolean = false;
  private healthCheckInterval?: NodeJS.Timeout;
  private auctionUpdateInterval?: NodeJS.Timeout;
  private errors: RelayerError[] = [];

  constructor(
    networks: string[],
    privateKey: string,
    fusionApiKey?: string
  ) {
    super();
    this.logger = new Logger('RelayerService');
    
    // Initialize network services
    this.initializeNetworkServices(networks, privateKey);
    
    // Initialize Fusion+ service
    this.fusionService = new FusionService(fusionApiKey, this.logger);
    
    this.logger.info('RelayerService initialized', {
      networks: networks,
      supportedChains: Array.from(this.networkServices.keys())
    });
  }

  /**
   * Initialize network services for supported chains
   */
  private initializeNetworkServices(networks: string[], privateKey: string): void {
    for (const network of networks) {
      try {
        const networkConfig = SUPPORTED_NETWORKS[network];
        if (!networkConfig) {
          this.logger.error(`Unsupported network: ${network}`);
          continue;
        }
        
        if (network.startsWith('etherlink')) {
          const service = new EtherlinkService(networkConfig, privateKey, this.logger);
          this.networkServices.set(network, service);
          this.logger.info(`Initialized ${network} service`);
        } else if (network.startsWith('monad')) {
          const service = new MonadService(network, privateKey);
          this.networkServices.set(network, service);
          this.logger.info(`Initialized ${network} service`);
        } else {
          // For other EVM networks, we'll use a generic EVM service
          // This could be extended to support other chain types
          this.logger.warn(`Generic EVM service not implemented for ${network}`);
        }
      } catch (error) {
        this.logger.error(`Failed to initialize ${network} service: ${error}`);
      }
    }
  }

  /**
   * Start the relayer service
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('RelayerService is already running');
      return;
    }

    try {
      this.logger.info('Starting RelayerService...');
      
      // Start event monitoring for all networks
      await this.startEventMonitoring();
      
      // Start health checks
      this.startHealthChecks();
      
      // Start auction rate updates
      this.startAuctionUpdates();
      
      // Start Fusion+ order monitoring
      await this.fusionService.start();
      
      this.isRunning = true;
      this.emit('started');
      
      this.logger.info('RelayerService started successfully');
      
    } catch (error) {
      this.logger.error(`Failed to start RelayerService: ${error}`);
      throw error;
    }
  }

  /**
   * Stop the relayer service
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.logger.info('Stopping RelayerService...');
    
    this.isRunning = false;
    
    // Clear intervals
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    if (this.auctionUpdateInterval) {
      clearInterval(this.auctionUpdateInterval);
    }
    
    // Stop Fusion+ service
    await this.fusionService.stop();
    
    this.emit('stopped');
    this.logger.info('RelayerService stopped');
  }

  /**
   * Start monitoring events on all configured networks
   */
  private async startEventMonitoring(): Promise<void> {
    for (const [network, service] of this.networkServices) {
      try {
        await service.startEventMonitoring(this.handleEscrowEvent.bind(this));
        this.logger.info(`Event monitoring started for ${network}`);
      } catch (error) {
        this.logger.error(`Failed to start event monitoring for ${network}: ${error}`);
      }
    }
  }

  /**
   * Handle escrow events from monitored networks
   */
  private async handleEscrowEvent(event: EscrowEvent): Promise<void> {
    this.logger.info(`Received escrow event: ${event.eventType}`, {
      orderId: event.orderId,
      escrowId: event.escrowId,
      blockNumber: event.blockNumber
    });

    try {
      switch (event.eventType) {
        case EscrowEventType.ESCROW_CREATED:
          await this.handleEscrowCreated(event);
          break;
          
        case EscrowEventType.ESCROW_WITHDRAWN:
          await this.handleEscrowWithdrawn(event);
          break;
          
        case EscrowEventType.ESCROW_CANCELLED:
          await this.handleEscrowCancelled(event);
          break;
          
        default:
          this.logger.warn(`Unknown event type: ${event.eventType}`);
      }
      
      // Emit event for external listeners (WebSocket, frontend, etc.)
      this.emit('escrowEvent', event);
      
    } catch (error) {
      this.logger.error(`Error handling escrow event: ${error}`, { event });
      this.addError('error', `Failed to handle ${event.eventType}: ${error}`, event.orderId);
    }
  }

  /**
   * Handle escrow creation event
   */
  private async handleEscrowCreated(event: EscrowEvent): Promise<void> {
    const { orderId, data } = event;
    
    // Update active order status
    const order = this.activeOrders.get(orderId);
    if (order) {
      order.status = FusionOrderStatus.ACCEPTED;
      this.activeOrders.set(orderId, order);
      this.logger.info(`Order ${orderId} accepted by resolver`);
    }

    // Create or update cross-chain swap tracking
    let swap = this.pendingSwaps.get(orderId);
    if (!swap) {
      // This is a new swap, create tracking entry
      swap = {
        orderId,
        sourceChain: '', // Will be determined
        destChain: '', // Will be determined  
        sourceEscrowId: '',
        destEscrowId: event.escrowId,
        status: CrossChainSwapStatus.DEST_LOCKED,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        executionDeadline: data.timelock * 1000 // Convert to milliseconds
      };
    } else {
      // Update existing swap
      swap.destEscrowId = event.escrowId;
      swap.status = CrossChainSwapStatus.DEST_LOCKED;
      swap.updatedAt = Date.now();
    }
    
    this.pendingSwaps.set(orderId, swap);
  }

  /**
   * Handle escrow withdrawal (secret revealed)
   */
  private async handleEscrowWithdrawn(event: EscrowEvent): Promise<void> {
    const { orderId, data } = event;
    const secret = data.secret;
    
    this.logger.info(`Secret revealed for order ${orderId}`, {
      secret: secret.substring(0, 10) + '...' // Log partial secret for debugging
    });

    // Update swap status
    const swap = this.pendingSwaps.get(orderId);
    if (swap) {
      swap.secret = secret;
      swap.status = CrossChainSwapStatus.SECRET_REVEALED;
      swap.updatedAt = Date.now();
      this.pendingSwaps.set(orderId, swap);
      
      // If this withdrawal was on the destination chain, complete the swap
      if (swap.destEscrowId === event.escrowId) {
        await this.completeSwap(orderId);
      } else {
        // Execute withdrawal on other chain
        await this.executeCounterWithdrawal(orderId, secret);
      }
    }

    // Update order status
    const order = this.activeOrders.get(orderId);
    if (order) {
      order.status = FusionOrderStatus.EXECUTING;
      this.activeOrders.set(orderId, order);
    }
  }

  /**
   * Handle escrow cancellation
   */
  private async handleEscrowCancelled(event: EscrowEvent): Promise<void> {
    const { orderId } = event;
    
    this.logger.info(`Escrow cancelled for order ${orderId}`);

    // Update swap status
    const swap = this.pendingSwaps.get(orderId);
    if (swap) {
      swap.status = CrossChainSwapStatus.FAILED;
      swap.updatedAt = Date.now();
      this.pendingSwaps.set(orderId, swap);
    }

    // Update order status
    const order = this.activeOrders.get(orderId);
    if (order) {
      order.status = FusionOrderStatus.CANCELLED;
      this.activeOrders.set(orderId, order);
    }
  }

  /**
   * Execute withdrawal on the counter-chain using revealed secret
   */
  private async executeCounterWithdrawal(orderId: string, secret: string): Promise<void> {
    const swap = this.pendingSwaps.get(orderId);
    if (!swap) {
      throw new Error(`Swap not found for order ${orderId}`);
    }

    try {
      // Determine which chain to execute on
      const sourceService = this.networkServices.get(swap.sourceChain);
      if (sourceService && swap.sourceEscrowId) {
        await sourceService.withdrawEscrow(swap.sourceEscrowId, secret);
        this.logger.info(`Counter-withdrawal executed for order ${orderId}`);
      }
      
      await this.completeSwap(orderId);
      
    } catch (error) {
      this.logger.error(`Failed to execute counter-withdrawal for order ${orderId}: ${error}`);
      throw error;
    }
  }

  /**
   * Complete the cross-chain swap
   */
  private async completeSwap(orderId: string): Promise<void> {
    const swap = this.pendingSwaps.get(orderId);
    if (swap) {
      swap.status = CrossChainSwapStatus.COMPLETED;
      swap.updatedAt = Date.now();
      this.pendingSwaps.set(orderId, swap);
    }

    const order = this.activeOrders.get(orderId);
    if (order) {
      order.status = FusionOrderStatus.COMPLETED;
      this.activeOrders.set(orderId, order);
    }

    this.logger.info(`Cross-chain swap completed for order ${orderId}`);
    this.emit('swapCompleted', { orderId, swap });
  }

  /**
   * Start health checks for all network services
   */
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(async () => {
      for (const [network, service] of this.networkServices) {
        try {
          const healthy = await service.isHealthy();
          if (!healthy) {
            this.logger.warn(`Health check failed for ${network}`);
            this.addError('warning', `Health check failed for ${network}`, undefined, network);
          }
        } catch (error) {
          this.logger.error(`Health check error for ${network}: ${error}`);
          this.addError('error', `Health check error for ${network}: ${error}`, undefined, network);
        }
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Start auction rate updates for active orders
   */
  private startAuctionUpdates(): void {
    this.auctionUpdateInterval = setInterval(async () => {
      for (const [orderId, order] of this.activeOrders) {
        if (order.status === FusionOrderStatus.AUCTION_ACTIVE) {
          try {
            // Update auction rates using Etherlink's fast finality
            await this.updateAuctionRate(orderId);
          } catch (error) {
            this.logger.error(`Failed to update auction rate for order ${orderId}: ${error}`);
          }
        }
      }
    }, 1000); // Update every second leveraging Etherlink's speed
  }

  /**
   * Update auction rate for an order
   */
  private async updateAuctionRate(orderId: string): Promise<void> {
    // Implementation would call the appropriate network service
    // to update the auction rate and emit the update
    this.emit('auctionUpdate', { orderId, timestamp: Date.now() });
  }

  /**
   * Add error to the error log
   */
  private addError(level: 'error' | 'warning' | 'info', message: string, orderId?: string, network?: string): void {
    const error: RelayerError = {
      timestamp: Date.now(),
      level,
      message,
      orderId,
      network
    };
    
    this.errors.push(error);
    
    // Keep only last 1000 errors
    if (this.errors.length > 1000) {
      this.errors = this.errors.slice(-1000);
    }
  }

  /**
   * Get current relayer state
   */
  getState(): RelayerState {
    return {
      isRunning: this.isRunning,
      connectedNetworks: Array.from(this.networkServices.keys()),
      lastBlockProcessed: {}, // Would track per network
      pendingSwaps: Array.from(this.pendingSwaps.values()),
      activeOrders: Array.from(this.activeOrders.values()),
      metrics: {
        totalOrders: this.activeOrders.size,
        successfulOrders: 0, // Calculate from completed orders
        failedOrders: 0,
        averageExecutionTime: 0,
        totalVolume: '0',
        profitLoss: '0',
        gasSpent: '0',
        uptime: this.isRunning ? Date.now() - (Date.now() - 3600000) : 0 // Placeholder
      },
      errors: this.errors.slice(-100) // Last 100 errors
    };
  }
}