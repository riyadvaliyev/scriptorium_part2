import React from 'react';

interface TemplateContentSearchBarProps {
  onSearchChange: (value: string) => void;
}

const TemplateContentSearchBar: React.FC<TemplateContentSearchBarProps> = ({ onSearchChange }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Type some code to search"
        className="w-full p-2 border rounded"
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default TemplateContentSearchBar;


