import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Clock, TrendingUp, Github, ExternalLink } from 'lucide-react';
import SwapInterface from './components/SwapInterface';
import './index.css';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-etherlink-500 to-fusion-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Etherlink Fusion+</h1>
                <p className="text-sm text-gray-600">Cross-chain DeFi Bridge</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium">Connect Wallet</span>
              </button>
              <a
                href="https://github.com/your-repo/etherlink-fusion-plus"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Cross-Chain Swaps
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-etherlink-500 to-fusion-500">
                  Reimagined
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Experience gasless, MEV-protected swaps between Etherlink and other chains using 1inch Fusion+ technology.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid gap-4"
            >
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">MEV Protection</h3>
                    <p className="text-sm text-gray-600">Zero front-running or sandwich attacks</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Ultra Fast</h3>
                    <p className="text-sm text-gray-600">Sub-500ms confirmations on Etherlink</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Dutch Auctions</h3>
                    <p className="text-sm text-gray-600">Get better rates over time</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Gasless Swaps</h3>
                    <p className="text-sm text-gray-600">Resolvers pay all gas fees</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl p-6 border border-gray-200"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Protocol Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-etherlink-600">$2.1M</p>
                  <p className="text-sm text-gray-600">Volume (24h)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-fusion-600">1,247</p>
                  <p className="text-sm text-gray-600">Swaps (24h)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">0.15%</p>
                  <p className="text-sm text-gray-600">Avg. Slippage</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">3.2s</p>
                  <p className="text-sm text-gray-600">Avg. Time</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Center Column - Swap Interface */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <SwapInterface />
            </motion.div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* How it Works */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-6 border border-gray-200"
            >
              <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <div className="w-6 h-6 bg-etherlink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Create Order</p>
                    <p className="text-sm text-gray-600">Submit your cross-chain swap intent</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="w-6 h-6 bg-etherlink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Dutch Auction</p>
                    <p className="text-sm text-gray-600">Resolvers compete with improving rates</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="w-6 h-6 bg-etherlink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Atomic Settlement</p>
                    <p className="text-sm text-gray-600">Trustless execution via HTLC</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Supported Networks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl p-6 border border-gray-200"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Supported Networks</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Etherlink', logo: '/images/etherlink-logo.svg' },
                  { name: 'Ethereum', logo: '/images/ethereum-logo.svg' },
                  { name: 'Arbitrum', logo: '/images/arbitrum-logo.svg' },
                  { name: 'Optimism', logo: '/images/optimism-logo.svg' },
                  { name: 'Polygon', logo: '/images/polygon-logo.svg' },
                  { name: 'Base', logo: '/images/base-logo.svg' }
                ].map((network) => (
                  <div
                    key={network.name}
                    className="flex flex-col items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full mb-2" />
                    <span className="text-xs font-medium text-gray-700">{network.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl p-6 border border-gray-200"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <div className="space-y-3">
                <a
                  href="https://docs.etherlink.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Etherlink Docs</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
                <a
                  href="https://blog.1inch.io/1inch-releases-a-white-paper-for-cross-chain-innovation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Fusion+ Whitepaper</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
                <a
                  href="https://ethglobal.com/events/unite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">ETHGlobal Unite</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Built with ❤️ for ETHGlobal Unite 2025 • Etherlink Track
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Powered by 1inch Fusion+ and Etherlink Technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;