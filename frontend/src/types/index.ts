export interface Network {
  id: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  explorer: string;
  logo: string;
  isTestnet: boolean;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUri?: string;
  chainId: number;
}

export interface SwapQuote {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  fromChain: Network;
  toChain: Network;
  rate: string;
  priceImpact: string;
  gas: string;
  timeEstimate: number;
}

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

export interface SwapState {
  fromToken?: Token;
  toToken?: Token;
  fromChain?: Network;
  toChain?: Network;
  fromAmount: string;
  toAmount: string;
  isLoading: boolean;
  quote?: SwapQuote;
  error?: string;
}

export interface DutchAuction {
  orderId: string;
  startRate: string;
  endRate: string;
  currentRate: string;
  startTime: number;
  endTime: number;
  progress: number;
  isActive: boolean;
}

export interface Transaction {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  type: 'approve' | 'swap' | 'withdraw' | 'cancel';
  timestamp: number;
  chainId: number;
}