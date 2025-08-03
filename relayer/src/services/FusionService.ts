/**
 * 1inch Fusion+ API integration service
 */

import axios, { AxiosInstance } from 'axios';
import { Logger } from '../utils/logger';
import { 
  FusionOrder, 
  FusionOrderStatus, 
  QuoteRequest, 
  QuoteResponse,
  FusionSDKConfig 
} from '../types/fusion';

export class FusionService {
  private api: AxiosInstance;
  private logger: Logger;
  private config: FusionSDKConfig;
  private isRunning: boolean = false;
  private orderPollingInterval?: NodeJS.Timeout;

  constructor(apiKey?: string, logger?: Logger) {
    this.logger = logger || new Logger('FusionService');
    
    this.config = {
      baseUrl: process.env.FUSION_API_URL || 'https://api.1inch.dev/fusion',
      apiKey: apiKey || process.env.FUSION_API_KEY,
      network: 1, // Default to Ethereum mainnet
      enableRateLimit: true,
      retryOptions: {
        maxRetries: 3,
        retryDelay: 1000
      }
    };

    this.api = axios.create({
      baseURL: this.config.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
      }
    });

    // Add request/response interceptors for logging and rate limiting
    this.setupInterceptors();

    this.logger.info('FusionService initialized', {
      baseUrl: this.config.baseUrl,
      hasApiKey: !!this.config.apiKey
    });
  }

  /**
   * Setup axios interceptors for logging and error handling
   */
  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config) => {
        this.logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data
        });
        return config;
      },
      (error) => {
        this.logger.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        this.logger.debug(`API Response: ${response.status} ${response.config.url}`, {
          data: response.data
        });
        return response;
      },
      async (error) => {
        this.logger.error('API Response Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });

        // Implement retry logic for certain errors
        if (this.shouldRetry(error) && error.config && !error.config._retryCount) {
          error.config._retryCount = 0;
        }

        if (error.config._retryCount < this.config.retryOptions.maxRetries) {
          error.config._retryCount++;
          this.logger.info(`Retrying request (${error.config._retryCount}/${this.config.retryOptions.maxRetries})`);
          
          await new Promise(resolve => 
            setTimeout(resolve, this.config.retryOptions.retryDelay)
          );
          
          return this.api.request(error.config);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Check if an error should trigger a retry
   */
  private shouldRetry(error: any): boolean {
    return (
      error.code === 'ECONNABORTED' ||
      error.code === 'ENOTFOUND' ||
      (error.response && [500, 502, 503, 504, 429].includes(error.response.status))
    );
  }

  /**
   * Start the Fusion+ service
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('FusionService is already running');
      return;
    }

    try {
      this.logger.info('Starting FusionService...');
      
      // Test API connectivity
      await this.testConnection();
      
      // Start polling for orders (if applicable)
      this.startOrderPolling();
      
      this.isRunning = true;
      this.logger.info('FusionService started successfully');
      
    } catch (error) {
      this.logger.error(`Failed to start FusionService: ${error}`);
      throw error;
    }
  }

  /**
   * Stop the Fusion+ service
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.logger.info('Stopping FusionService...');
    
    if (this.orderPollingInterval) {
      clearInterval(this.orderPollingInterval);
    }
    
    this.isRunning = false;
    this.logger.info('FusionService stopped');
  }

  /**
   * Test API connection
   */
  private async testConnection(): Promise<void> {
    try {
      // This would be replaced with actual Fusion+ API health check
      const response = await this.api.get('/health');
      this.logger.info('Fusion+ API connection successful');
    } catch (error) {
      this.logger.warn('Fusion+ API connection test skipped (endpoint may not exist)');
      // Don't throw error as this might be expected during development
    }
  }

  /**
   * Start polling for new Fusion+ orders
   */
  private startOrderPolling(): void {
    this.orderPollingInterval = setInterval(async () => {
      try {
        await this.pollForOrders();
      } catch (error) {
        this.logger.error(`Error polling for orders: ${error}`);
      }
    }, 5000); // Poll every 5 seconds
  }

  /**
   * Poll for new Fusion+ orders
   */
  private async pollForOrders(): Promise<void> {
    // This would integrate with actual 1inch Fusion+ order stream
    // For now, this is a placeholder implementation
    this.logger.debug('Polling for new Fusion+ orders...');
  }

  /**
   * Get quote for token swap
   */
  async getQuote(request: QuoteRequest): Promise<QuoteResponse> {
    try {
      this.logger.info('Getting quote from Fusion+', request);

      const response = await this.api.get('/quote', {
        params: {
          src: request.src,
          dst: request.dst,
          amount: request.amount,
          from: request.from,
          slippage: request.slippage,
          gasPrice: request.gasPrice
        }
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to get quote:', error);
      throw error;
    }
  }

  /**
   * Submit a Fusion+ order
   */
  async submitOrder(order: Partial<FusionOrder>): Promise<string> {
    try {
      this.logger.info('Submitting Fusion+ order', {
        orderId: order.orderId,
        srcChainId: order.srcChainId,
        destChainId: order.destChainId,
        srcAmount: order.srcAmount,
        destAmount: order.destAmount
      });

      const response = await this.api.post('/orders', order);
      
      const orderId = response.data.orderId;
      this.logger.info(`Order submitted successfully: ${orderId}`);
      
      return orderId;
    } catch (error) {
      this.logger.error('Failed to submit order:', error);
      throw error;
    }
  }

  /**
   * Get order status
   */
  async getOrderStatus(orderId: string): Promise<FusionOrder> {
    try {
      const response = await this.api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get order status for ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string): Promise<void> {
    try {
      this.logger.info(`Cancelling order ${orderId}`);
      await this.api.delete(`/orders/${orderId}`);
      this.logger.info(`Order ${orderId} cancelled successfully`);
    } catch (error) {
      this.logger.error(`Failed to cancel order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Get supported tokens for a network
   */
  async getSupportedTokens(chainId: number): Promise<any[]> {
    try {
      const response = await this.api.get(`/tokens/${chainId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get supported tokens for chain ${chainId}:`, error);
      throw error;
    }
  }

  /**
   * Get network status
   */
  async getNetworkStatus(chainId: number): Promise<any> {
    try {
      const response = await this.api.get(`/networks/${chainId}/status`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get network status for chain ${chainId}:`, error);
      throw error;
    }
  }

  /**
   * Sign order (placeholder - would integrate with actual signing)
   */
  async signOrder(order: Partial<FusionOrder>, privateKey: string): Promise<string> {
    // This would implement proper order signing according to 1inch Fusion+ spec
    this.logger.info('Signing order', { orderId: order.orderId });
    
    // Placeholder signature
    return `0x${'a'.repeat(130)}`;
  }

  /**
   * Validate order
   */
  validateOrder(order: Partial<FusionOrder>): boolean {
    const required = ['maker', 'receiver', 'srcChainId', 'destChainId', 'srcToken', 'destToken', 'srcAmount', 'destAmount'];
    
    for (const field of required) {
      if (!order[field as keyof FusionOrder]) {
        this.logger.error(`Order validation failed: missing ${field}`);
        return false;
      }
    }
    
    return true;
  }

  /**
   * Calculate current auction rate
   */
  calculateAuctionRate(
    startRate: string,
    endRate: string,
    startTime: number,
    endTime: number,
    currentTime: number = Date.now()
  ): string {
    const totalDuration = endTime - startTime;
    const elapsed = currentTime - startTime;
    
    if (elapsed <= 0) return startRate;
    if (elapsed >= totalDuration) return endRate;
    
    const startBN = BigInt(startRate);
    const endBN = BigInt(endRate);
    const progress = BigInt(elapsed) * BigInt(1000000) / BigInt(totalDuration); // Use 6 decimal precision
    
    const rateRange = startBN - endBN;
    const rateDecrease = rateRange * progress / BigInt(1000000);
    
    return (startBN - rateDecrease).toString();
  }
}