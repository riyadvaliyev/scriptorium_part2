import React from 'react';

interface TemplateExplanationSearchBarProps {
  onSearchChange: (value: string) => void;
}

const TemplateExplanationSearchBar: React.FC<TemplateExplanationSearchBarProps> = ({ onSearchChange }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search an explanation"
        className="w-full p-2 border rounded"
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default TemplateExplanationSearchBar;


