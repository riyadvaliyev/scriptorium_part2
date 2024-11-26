import React from 'react';

interface TemplateSearchBarProps {
  onSearchChange: (value: string) => void;
}

const TemplateSearchBar: React.FC<TemplateSearchBarProps> = ({ onSearchChange }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search code templates..."
        className="w-full p-2 border rounded"
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default TemplateSearchBar;


