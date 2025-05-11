// src/components/Template/TemplatePages.tsx
import React from 'react';

interface TemplatePagesProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TemplatePages: React.FC<TemplatePagesProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
    if (totalPages === 0) onPageChange(0);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
    if (totalPages === 0) onPageChange(0);
  };

  return (
    <div className="flex justify-center items-center space-x-4 my-4">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1 || totalPages === 0}
        className={`px-4 py-2 border rounded ${
          currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-100'
        }`}
      >
        Previous
      </button>
      <span>
        Page {currentPage > totalPages ? 0 : currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages || totalPages === 0}
        className={`px-4 py-2 border rounded ${
          (currentPage === totalPages || totalPages === 0) ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-100'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default TemplatePages;
