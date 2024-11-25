import React from 'react';

interface BlogSearchBarProps {
  onSearchChange: (value: string) => void;
}

const BlogSearchBar: React.FC<BlogSearchBarProps> = ({ onSearchChange }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search blog posts..."
        className="w-full p-2 border rounded"
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default BlogSearchBar;


