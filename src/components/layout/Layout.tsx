// src/components/layout/Layout.tsx
import React from 'react';
import Header from './Header';
import Attribution from '@/components/Attribution';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
      <footer className="bg-white shadow-inner py-4">
        <div className="container mx-auto px-4 text-xs text-gray-500 text-center">
          <Attribution /> {/* Include Attribution in Footer */}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
