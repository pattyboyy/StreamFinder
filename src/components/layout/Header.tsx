// src/components/layout/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            Stream Finder
          </Link>
          <div className="flex gap-4">
            <Link to="/" className="text-gray-600 hover:text-primary">
              Home
            </Link>
            <Link to="/watchlist" className="text-gray-600 hover:text-primary">
              Watchlist
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;