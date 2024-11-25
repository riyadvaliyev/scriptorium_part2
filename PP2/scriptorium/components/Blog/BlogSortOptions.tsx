// src/components/Blog/BlogSortOptions.tsx
import React from 'react';

interface BlogSortOptionsProps {
  onSortChange: (sortOption: 'most_controversial' | 'most_valued' | '') => void;
}

const BlogSortOptions: React.FC<BlogSortOptionsProps> = ({ onSortChange }) => {
  return (
    <div className="mb-4">
      <select
        onChange={(e) => onSortChange(e.target.value as 'most_controversial' | 'most_valued' | '')}
        className="p-2 border rounded w-full"
      >
        <option value="">Sort by</option>
        <option value="most_valued">Most Valued</option>
        <option value="most_controversial">Most Controversial</option>
      </select>
    </div>
  );
};

export default BlogSortOptions;

