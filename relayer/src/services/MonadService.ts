import { ethers } from 'ethers';
import { Logger } from '../utils/logger';
import { SUPPORTED_NETWORKS } from '../config/networks';

const logger = new Logger('MonadService');

export class MonadService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private network: string;

  constructor(network: string, privateKey: string) {
    const networkConfig = SUPPORTED_NETWORKS[network];
    if (!networkConfig) {
      throw new Error(`Unsupported network: ${network}`);
    }

    this.network = network;
    this.provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);
  }

  /**
   * Get Monad network information
   */
  async getNetworkInfo() {
    try {
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      const gasPrice = await this.provider.getFeeData();

      return {
        chainId: network.chainId,
        blockNumber,
        gasPrice: gasPrice.gasPrice?.toString(),
        network: this.network
      };
    } catch (error) {
      logger.error('Failed to get Monad network info:', error);
      throw error;
    }
  }

  /**
   * Get account balance on Monad
   */
  async getBalance(address: string) {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      logger.error('Failed to get Monad balance:', error);
      throw error;
    }
  }

  /**
   * Send transaction on Monad
   */
  async sendTransaction(to: string, value: string, data: string = '0x') {
    try {
      const tx = {
        to,
        value: ethers.parseEther(value),
        data
      };

      const transaction = await this.signer.sendTransaction(tx);
      logger.info(`Monad transaction sent: ${transaction.hash}`);
      
      return {
        hash: transaction.hash,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value.toString(),
        gasLimit: transaction.gasLimit?.toString(),
        gasPrice: transaction.gasPrice?.toString()
      };
    } catch (error) {
      logger.error('Failed to send Monad transaction:', error);
      throw error;
    }
  }

  /**
   * Wait for transaction confirmation on Monad
   */
  async waitForTransaction(hash: string, confirmations: number = 1) {
    try {
      const receipt = await this.provider.waitForTransaction(hash, confirmations);
      logger.info(`Monad transaction confirmed: ${hash}`);
      
      if (!receipt) {
        throw new Error('Transaction receipt not found');
      }
      
      return {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed?.toString(),
        status: receipt.status
      };
    } catch (error) {
      logger.error('Failed to wait for Monad transaction:', error);
      throw error;
    }
  }

  /**
   * Get transaction receipt on Monad
   */
  async getTransactionReceipt(hash: string) {
    try {
      const receipt = await this.provider.getTransactionReceipt(hash);
      return receipt;
    } catch (error) {
      logger.error('Failed to get Monad transaction receipt:', error);
      throw error;
    }
  }

  /**
   * Estimate gas for transaction on Monad
   */
  async estimateGas(to: string, value: string, data: string = '0x') {
    try {
      const gasEstimate = await this.provider.estimateGas({
        to,
        value: ethers.parseEther(value),
        data
      });
      
      return gasEstimate.toString();
    } catch (error) {
      logger.error('Failed to estimate Monad gas:', error);
      throw error;
    }
  }

  /**
   * Get current gas price on Monad
   */
  async getGasPrice() {
    try {
      const feeData = await this.provider.getFeeData();
      return {
        gasPrice: feeData.gasPrice?.toString(),
        maxFeePerGas: feeData.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString()
      };
    } catch (error) {
      logger.error('Failed to get Monad gas price:', error);
      throw error;
    }
  }

  /**
   * Get block information on Monad
   */
  async getBlock(blockNumber: number) {
    try {
      const block = await this.provider.getBlock(blockNumber);
      
      if (!block) {
        throw new Error('Block not found');
      }
      
      return {
        number: block.number,
        hash: block.hash,
        timestamp: block.timestamp,
        transactions: block.transactions.length
      };
    } catch (error) {
      logger.error('Failed to get Monad block:', error);
      throw error;
    }
  }

  /**
   * Get latest block number on Monad
   */
  async getLatestBlockNumber() {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      logger.error('Failed to get Monad latest block number:', error);
      throw error;
    }
  }

  /**
   * Check if address is valid on Monad
   */
  isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  /**
   * Format address for Monad display
   */
  formatAddress(address: string): string {
    if (!this.isValidAddress(address)) {
      throw new Error('Invalid address');
    }
    return ethers.getAddress(address);
  }
} 