// src/components/Blog/BlogPagination.tsx
// import React from 'react';

// interface BlogPaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// const BlogPagination: React.FC<BlogPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
//   const handlePrev = () => {
//     if (currentPage > 1) onPageChange(currentPage - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) onPageChange(currentPage + 1);
//   };

//   return (
//     <div className="flex justify-center items-center space-x-4 my-4">
//       <button
//         onClick={handlePrev}
//         disabled={currentPage === 1}
//         className={`px-4 py-2 border rounded ${
//           currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-100'
//         }`}
//       >
//         Previous
//       </button>
//       <span>
//         Page {currentPage} of {totalPages}
//       </span>
//       <button
//         onClick={handleNext}
//         disabled={currentPage === totalPages}
//         className={`px-4 py-2 border rounded ${
//           currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-100'
//         }`}
//       >
//         Next
//       </button>
//     </div>
//   );
// };

// export default BlogPagination;

import React from 'react';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const BlogPagination: React.FC<BlogPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center items-center space-x-4 my-4">
      {/* Disable the Previous button if there's no valid page */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1 || totalPages === 0}
        className={`px-4 py-2 border rounded ${
          currentPage === 1 || totalPages === 0
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-500 hover:bg-blue-100'
        }`}
      >
        Previous
      </button>
      <span>
        {totalPages === 0
          ? 'Page 0 of 0' // Display for no pages
          : `Page ${currentPage} of ${totalPages}`} {/* Display for valid pages */}
      </span>
      {/* Disable the Next button if there's no valid page */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages || totalPages === 0}
        className={`px-4 py-2 border rounded ${
          currentPage === totalPages || totalPages === 0
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-500 hover:bg-blue-100'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default BlogPagination;
