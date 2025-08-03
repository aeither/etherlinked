import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Token } from '../types';

interface TokenSelectorProps {
  value?: Token;
  onChange: (token: Token) => void;
  tokens: Token[];
  className?: string;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  value,
  onChange,
  tokens,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = tokens.filter(token =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (token: Token) => {
    onChange(token);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors w-full"
      >
        {value ? (
          <>
            {value.logoUri && (
              <img
                src={value.logoUri}
                alt={value.symbol}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            <span className="font-medium">{value.symbol}</span>
          </>
        ) : (
          <span className="text-gray-500">Select token</span>
        )}
        <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tokens..."
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-etherlink-500"
              />
            </div>
          </div>

          {/* Token List */}
          <div className="max-h-40 overflow-y-auto">
            {filteredTokens.length > 0 ? (
              filteredTokens.map((token) => (
                <button
                  key={`${token.address}-${token.chainId}`}
                  onClick={() => handleSelect(token)}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                >
                  {token.logoUri && (
                    <img
                      src={token.logoUri}
                      alt={token.symbol}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">{token.symbol}</div>
                    <div className="text-sm text-gray-500 truncate">{token.name}</div>
                  </div>
                  {token.address !== '0x0000000000000000000000000000000000000000' && (
                    <div className="text-xs text-gray-400 font-mono">
                      {token.address.slice(0, 6)}...{token.address.slice(-4)}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500 text-sm">
                No tokens found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default TokenSelector;