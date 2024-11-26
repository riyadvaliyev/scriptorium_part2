// src/components/SearchBar.tsx
import React, { useState } from 'react';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log(`Search initiated with query: ${query}`);
    // Perform API call to search endpoint
  };

  return (
    <div className="my-4 flex justify-center">
      <input
        type="text"
        placeholder="Search blog posts or templates..."
        className="border rounded-l-md p-2 w-2/3"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-r-md"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
