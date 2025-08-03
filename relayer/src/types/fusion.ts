/**
 * Type definitions for 1inch Fusion+ integration
 */

export interface FusionOrder {
  orderId: string;
  maker: string;
  receiver: string;
  srcChainId: number;
  destChainId: number;
  srcToken: string;
  destToken: string;
  srcAmount: string;
  destAmount: string;
  secretHash: string;
  timelock: number;
  auctionStartTime: number;
  auctionEndTime: number;
  startRate: string;
  endRate: string;
  signature: string;
  status: FusionOrderStatus;
}

export enum FusionOrderStatus {
  PENDING = "pending",
  AUCTION_ACTIVE = "auction_active", 
  ACCEPTED = "accepted",
  EXECUTING = "executing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  FAILED = "failed"
}

export interface DutchAuctionState {
  orderId: string;
  currentRate: string;
  timeElapsed: number;
  totalDuration: number;
  percentageComplete: number;
  isActive: boolean;
}

export interface EscrowEvent {
  eventType: EscrowEventType;
  escrowId: string;
  orderId: string;
  blockNumber: number;
  transactionHash: string;
  timestamp: number;
  data: any;
}

export enum EscrowEventType {
  ESCROW_CREATED = "EscrowCreated",
  ESCROW_WITHDRAWN = "EscrowWithdrawn", 
  ESCROW_CANCELLED = "EscrowCancelled",
  SECRET_REVEALED = "SecretRevealed",
  AUCTION_RATE_UPDATED = "AuctionRateUpdated"
}

export interface CrossChainSwap {
  orderId: string;
  sourceChain: string;
  destChain: string;
  sourceEscrowId: string;
  destEscrowId: string;
  secret?: string;
  status: CrossChainSwapStatus;
  createdAt: number;
  updatedAt: number;
  executionDeadline: number;
}

export enum CrossChainSwapStatus {
  INITIATED = "initiated",
  SOURCE_LOCKED = "source_locked",
  DEST_LOCKED = "dest_locked", 
  SECRET_REVEALED = "secret_revealed",
  COMPLETED = "completed",
  FAILED = "failed",
  RECOVERING = "recovering"
}

export interface ResolverMetrics {
  totalOrders: number;
  successfulOrders: number;
  failedOrders: number;
  averageExecutionTime: number;
  totalVolume: string;
  profitLoss: string;
  gasSpent: string;
  uptime: number;
}

export interface RelayerState {
  isRunning: boolean;
  connectedNetworks: string[];
  lastBlockProcessed: Record<string, number>;
  pendingSwaps: CrossChainSwap[];
  activeOrders: FusionOrder[];
  metrics: ResolverMetrics;
  errors: RelayerError[];
}

export interface RelayerError {
  timestamp: number;
  level: 'error' | 'warning' | 'info';
  message: string;
  orderId?: string;
  network?: string;
  details?: any;
}

export interface WebSocketMessage {
  type: 'order_update' | 'swap_status' | 'error' | 'metrics';
  data: any;
  timestamp: number;
}

// 1inch Fusion+ SDK Integration
export interface FusionSDKConfig {
  baseUrl: string;
  apiKey?: string;
  network: number;
  enableRateLimit: boolean;
  retryOptions: {
    maxRetries: number;
    retryDelay: number;
  };
}

export interface QuoteRequest {
  src: string;
  dst: string;
  amount: string;
  from: string;
  slippage: number;
  gasPrice?: string;
}

export interface QuoteResponse {
  dstAmount: string;
  tx: {
    to: string;
    data: string;
    value: string;
    gasPrice: string;
    gas: number;
  };
  protocols: any[];
}