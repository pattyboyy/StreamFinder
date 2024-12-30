// src/pages/Home.tsx
import React from 'react';
import SearchBar from '../components/SearchBar';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-4xl font-bold text-center mb-8">
        Find where to watch your favorite movies and shows
      </h1>
      <SearchBar />
    </div>
  );
};

export default Home;