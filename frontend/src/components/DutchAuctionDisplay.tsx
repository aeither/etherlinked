import React, { useState, useEffect } from 'react';
import { TrendingDown, Clock, ExternalLink, Copy } from 'lucide-react';
import { FusionOrder, FusionOrderStatus } from '../types';
import { useSwapStore } from '../store/swapStore';

interface DutchAuctionDisplayProps {
  order: FusionOrder;
}

const DutchAuctionDisplay: React.FC<DutchAuctionDisplayProps> = ({ order }) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const { updateAuction } = useSwapStore();

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate auction progress
  const auctionStartMs = order.auctionStartTime * 1000;
  const auctionEndMs = order.auctionEndTime * 1000;
  const totalDuration = auctionEndMs - auctionStartMs;
  const elapsed = Math.max(0, currentTime - auctionStartMs);
  const progress = Math.min(100, (elapsed / totalDuration) * 100);
  const timeRemaining = Math.max(0, auctionEndMs - currentTime);

  // Calculate current rate
  const startRate = parseFloat(order.startRate);
  const endRate = parseFloat(order.endRate);
  const rateRange = startRate - endRate;
  const currentRate = startRate - (rateRange * progress / 100);

  // Update auction state
  useEffect(() => {
    const auction = {
      orderId: order.orderId,
      startRate: order.startRate,
      endRate: order.endRate,
      currentRate: currentRate.toString(),
      startTime: order.auctionStartTime,
      endTime: order.auctionEndTime,
      progress,
      isActive: order.status === FusionOrderStatus.AUCTION_ACTIVE && timeRemaining > 0
    };
    updateAuction(auction);
  }, [order, currentRate, progress, timeRemaining, updateAuction]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getStatusColor = (status: FusionOrderStatus): string => {
    switch (status) {
      case FusionOrderStatus.AUCTION_ACTIVE:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case FusionOrderStatus.ACCEPTED:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case FusionOrderStatus.EXECUTING:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case FusionOrderStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case FusionOrderStatus.CANCELLED:
      case FusionOrderStatus.FAILED:
        return 'bg-red-100 text-red-800 border-red-200';
      case FusionOrderStatus.EXPIRED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
  };

  const priceImprovement = ((startRate - currentRate) / startRate * 100).toFixed(2);

  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-4 bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingDown className="w-5 h-5 text-etherlink-500" />
          <h4 className="font-semibold text-gray-900">Dutch Auction</h4>
        </div>
        <div className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
          {order.status.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      {/* Order ID */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Order:</span>
        <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
          {order.orderId.slice(0, 8)}...{order.orderId.slice(-8)}
        </code>
        <button
          onClick={copyOrderId}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <Copy className="w-3 h-3" />
        </button>
      </div>

      {/* Auction Progress */}
      {order.status === FusionOrderStatus.AUCTION_ACTIVE && (
        <>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Auction Progress</span>
              <span className="font-medium">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-etherlink-500 to-fusion-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Time Remaining */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Time Remaining:</span>
            </div>
            <span className="font-medium text-gray-900">
              {timeRemaining > 0 ? formatTime(timeRemaining) : 'Expired'}
            </span>
          </div>

          {/* Current Rate */}
          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Current Rate</p>
                <p className="text-lg font-bold text-gray-900">
                  {(currentRate / 1000000).toFixed(6)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Improvement</p>
                <p className="text-lg font-bold text-green-600">
                  +{priceImprovement}%
                </p>
              </div>
            </div>
          </div>

          {/* Rate Range */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-blue-50 rounded-lg p-2">
              <p className="text-blue-600 font-medium">Start Rate</p>
              <p className="text-blue-900 font-bold">
                {(startRate / 1000000).toFixed(6)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-2">
              <p className="text-green-600 font-medium">End Rate</p>
              <p className="text-green-900 font-bold">
                {(endRate / 1000000).toFixed(6)}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Swap Details */}
      <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">From:</span>
          <span className="font-medium">{order.srcAmount} {order.srcToken.slice(-3)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">To:</span>
          <span className="font-medium">{order.destAmount} {order.destToken.slice(-3)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Route:</span>
          <span className="font-medium">
            Chain {order.srcChainId} → Chain {order.destChainId}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {order.status === FusionOrderStatus.AUCTION_ACTIVE && timeRemaining > 0 && (
        <div className="flex space-x-2 pt-2">
          <button className="flex-1 py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors">
            Cancel Order
          </button>
          <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Completed Status */}
      {order.status === FusionOrderStatus.COMPLETED && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-800 font-medium text-sm">
              Swap completed successfully!
            </span>
          </div>
        </div>
      )}

      {/* Failed Status */}
      {(order.status === FusionOrderStatus.FAILED || order.status === FusionOrderStatus.CANCELLED) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-red-800 font-medium text-sm">
              {order.status === FusionOrderStatus.FAILED ? 'Swap failed' : 'Order cancelled'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DutchAuctionDisplay;