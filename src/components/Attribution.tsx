// src/components/Attribution.tsx
import React from 'react';

const Attribution: React.FC = () => {
  return (
    <div className="mt-4 text-xs text-gray-500 text-center">
      Streaming data powered by <a href="https://watchmode.com" target="_blank" rel="noopener noreferrer" className="underline">Watchmode.com</a>
    </div>
  );
};

export default Attribution;
