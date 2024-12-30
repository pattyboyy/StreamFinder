// src/components/SearchBar.tsx
import { useState, type FC, type FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export const SearchBar: FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for movies or TV shows..."
          className="input-primary w-full pl-12"
        />
        <button type="submit" className="absolute right-2 top-2 btn-primary">
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
