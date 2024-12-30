// src/components/StreamingBadge.tsx
import React from 'react';
import { StreamingProvider } from '../types/streaming';
import { ExternalLink } from 'lucide-react';

interface StreamingBadgeProps {
  provider: StreamingProvider;
  price?: number; // Optional prop
}

/**
 * Displays a badge for a streaming provider with its details.
 */
export const StreamingBadge: React.FC<StreamingBadgeProps> = ({ provider, price }) => {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
      <img
        src={provider.logo}
        alt={provider.name}
        className="w-6 h-6 rounded-full"
      />
      <span className="font-medium">{provider.name}</span>
      {provider.requiresSubscription ? (
        <span className="text-xs text-blue-600">
          Requires Subscription
        </span>
      ) : (
        <span className="text-xs text-green-600">
          Free
        </span>
      )}
      {price && (
        <span className="text-xs text-gray-600">
          ${price.toFixed(2)}
        </span>
      )}
      {provider.streamingUrl && (
        <a href={provider.streamingUrl} target="_blank" rel="noopener noreferrer" className="ml-auto">
          <ExternalLink className="w-4 h-4 text-gray-500 hover:text-gray-700" />
        </a>
      )}
    </div>
  );
};

export default StreamingBadge;
