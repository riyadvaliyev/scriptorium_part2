import React from 'react';

interface TemplateTagsSearchBarProps {
  onSearchChange: (value: string) => void;
}

const TemplateTagsSearchBar: React.FC<TemplateTagsSearchBarProps> = ({ onSearchChange }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Enter comma separated tags"
        className="w-full p-2 border rounded"
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default TemplateTagsSearchBar;


