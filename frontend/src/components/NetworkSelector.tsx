import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Network } from '../types';
import { SUPPORTED_NETWORKS } from '../config/networks';

interface NetworkSelectorProps {
  value?: Network;
  onChange: (network: Network) => void;
  label?: string;
  className?: string;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  value,
  onChange,
  label,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const networks = Object.values(SUPPORTED_NETWORKS);

  const handleSelect = (network: Network) => {
    onChange(network);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
      >
        {value ? (
          <>
            <img
              src={value.logo}
              alt={value.name}
              className="w-5 h-5 rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <span className="font-medium text-sm">{value.name}</span>
            {value.isTestnet && (
              <span className="px-1.5 py-0.5 text-xs bg-orange-100 text-orange-600 rounded">
                Testnet
              </span>
            )}
          </>
        ) : (
          <span className="text-gray-500 text-sm">{label || 'Select network'}</span>
        )}
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-48 max-h-60 overflow-y-auto">
          {networks.map((network) => (
            <button
              key={network.id}
              onClick={() => handleSelect(network)}
              className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
            >
              <img
                src={network.logo}
                alt={network.name}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{network.name}</div>
                <div className="text-xs text-gray-500">Chain ID: {network.id}</div>
              </div>
              {network.isTestnet && (
                <span className="px-1.5 py-0.5 text-xs bg-orange-100 text-orange-600 rounded">
                  Testnet
                </span>
              )}
            </button>
          ))}
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

export default NetworkSelector;