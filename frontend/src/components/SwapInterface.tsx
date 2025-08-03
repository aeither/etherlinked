import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Zap, Clock, Shield, TrendingUp } from 'lucide-react';
import { useSwapStore } from '../store/swapStore';
import { SUPPORTED_NETWORKS, getTokensByChainId } from '../config/networks';
import { FusionOrderStatus } from '../types';
import TokenSelector from './TokenSelector';
import NetworkSelector from './NetworkSelector';
import DutchAuctionDisplay from './DutchAuctionDisplay';

const SwapInterface: React.FC = () => {
  const {
    fromToken,
    toToken,
    fromChain,
    toChain,
    fromAmount,
    toAmount,
    isLoading,
    error,
    setFromAmount,
    setFromChain,
    setToChain,
    swapTokens,
    setLoading,
    setError,
    activeOrders,
    addOrder
  } = useSwapStore();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [slippage, setSlippage] = useState('0.5');
  const [auctionDuration, setAuctionDuration] = useState('300'); // 5 minutes default

  // Set default networks on mount
  useEffect(() => {
    if (!fromChain) {
      setFromChain(SUPPORTED_NETWORKS.etherlinkTestnet);
    }
    if (!toChain) {
      setToChain(SUPPORTED_NETWORKS.ethereum);
    }
  }, [fromChain, toChain, setFromChain, setToChain]);

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || !fromChain || !toChain) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(undefined);

      // Generate order ID
      const orderId = `fusion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create Fusion+ order
      const order = {
        orderId,
        maker: '0x...', // Would come from connected wallet
        receiver: '0x...', // Would come from connected wallet
        srcChainId: fromChain.id,
        destChainId: toChain.id,
        srcToken: fromToken.address,
        destToken: toToken.address,
        srcAmount: fromAmount,
        destAmount: toAmount,
        secretHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Would be properly generated
        timelock: Math.floor(Date.now() / 1000) + parseInt(auctionDuration) + 3600, // 1 hour after auction
        auctionStartTime: Math.floor(Date.now() / 1000),
        auctionEndTime: Math.floor(Date.now() / 1000) + parseInt(auctionDuration),
        startRate: '1000000', // Would be calculated from quote
        endRate: '980000', // 2% improvement over auction duration
        signature: '0x...', // Would be signed by wallet
        status: FusionOrderStatus.AUCTION_ACTIVE
      };

      // Add to active orders
      addOrder(order);

      // Simulate API call to submit order
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Fusion+ order submitted:', order);
      
    } catch (err) {
      console.error('Swap error:', err);
      setError(err instanceof Error ? err.message : 'Swap failed');
    } finally {
      setLoading(false);
    }
  };

  const getFeeInfo = () => {
    if (!fromChain) return null;
    
    if (fromChain.name.includes('Etherlink')) {
      return {
        gasFee: '~$0.001',
        speed: '< 500ms',
        security: 'MEV Protected'
      };
    }
    
    return {
      gasFee: '~$5-20',
      speed: '~12s',
      security: 'Standard'
    };
  };

  const feeInfo = getFeeInfo();

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Zap className="w-6 h-6 text-fusion-500" />
          <h2 className="text-2xl font-bold text-gray-900">Fusion+ Swap</h2>
        </div>
        <p className="text-sm text-gray-600">
          Gasless cross-chain swaps with MEV protection
        </p>
      </div>

      {/* From Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">From</label>
        <div className="border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <NetworkSelector 
              value={fromChain}
              onChange={setFromChain}
              label="From Network"
            />
            <div className="text-right">
              <p className="text-xs text-gray-500">Balance</p>
              <p className="text-sm font-medium">0.0</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <TokenSelector
              value={fromToken}
              onChange={(token) => useSwapStore.getState().setFromToken(token)}
              tokens={fromChain ? getTokensByChainId(fromChain.id) : []}
              className="flex-1"
            />
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 text-right text-lg font-medium border-0 focus:ring-0 p-0"
            />
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center">
        <button
          onClick={swapTokens}
          className="p-2 rounded-full border-2 border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          <ArrowUpDown className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* To Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">To</label>
        <div className="border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <NetworkSelector 
              value={toChain}
              onChange={setToChain}
              label="To Network"
            />
            <div className="text-right">
              <p className="text-xs text-gray-500">Balance</p>
              <p className="text-sm font-medium">0.0</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <TokenSelector
              value={toToken}
              onChange={(token) => useSwapStore.getState().setToToken(token)}
              tokens={toChain ? getTokensByChainId(toChain.id) : []}
              className="flex-1"
            />
            <input
              type="number"
              value={toAmount}
              onChange={(e) => useSwapStore.getState().setToAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 text-right text-lg font-medium border-0 focus:ring-0 p-0"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Fee Information */}
      {feeInfo && (
        <div className="bg-gradient-to-r from-etherlink-50 to-fusion-50 rounded-xl p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-etherlink-600" />
              <span className="font-medium">Fee: {feeInfo.gasFee}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-etherlink-600" />
              <span>Speed: {feeInfo.speed}</span>
            </div>
          </div>
          <div className="mt-2 flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-700 font-medium">{feeInfo.security}</span>
          </div>
        </div>
      )}

      {/* Advanced Settings */}
      <div className="space-y-3">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Advanced Settings {showAdvanced ? '▲' : '▼'}
        </button>
        
        {showAdvanced && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slippage Tolerance
              </label>
              <div className="flex space-x-2">
                {['0.1', '0.5', '1.0'].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSlippage(value)}
                    className={`px-3 py-1 text-sm rounded-lg border ${
                      slippage === value
                        ? 'border-etherlink-500 bg-etherlink-50 text-etherlink-700'
                        : 'border-gray-200 bg-white text-gray-600'
                    }`}
                  >
                    {value}%
                  </button>
                ))}
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded-lg"
                  placeholder="Custom"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auction Duration (seconds)
              </label>
              <input
                type="number"
                value={auctionDuration}
                onChange={(e) => setAuctionDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="300"
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={isLoading || !fromToken || !toToken || !fromAmount}
        className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
          isLoading || !fromToken || !toToken || !fromAmount
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-etherlink-500 to-fusion-500 hover:from-etherlink-600 hover:to-fusion-600 shadow-lg hover:shadow-xl'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Creating Fusion+ Order...</span>
          </div>
        ) : (
          'Start Dutch Auction'
        )}
      </button>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Active Orders</h3>
          {activeOrders.map((order) => (
            <DutchAuctionDisplay key={order.orderId} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SwapInterface;