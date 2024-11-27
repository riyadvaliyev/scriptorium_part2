import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Shared/Navbar';

const AdminReports: React.FC = () => {
  const [contentType, setContentType] = useState<'BlogPost' | 'Comment'>('BlogPost');
  const [contentList, setContentList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchSortedContent = async () => {
    try {
      const response = await fetch(
        `/api/admin/sortContentByReports?contentType=${contentType}&pageNumber=${currentPage}&limitNumber=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch sorted content.');

      const data = await response.json();
      setContentList(data);
    } catch (error) {
      console.error('Error fetching sorted content:', error);
    }
  };

  const toggleVisibility = async (id: number, isHidden: boolean) => {
    try {
      const response = await fetch(`/api/admin/toggleVisibility`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          contentType,
          id,
          hidden: !isHidden,
        }),
      });

      if (!response.ok) throw new Error('Failed to toggle visibility.');

      setContentList((prevList) =>
        prevList.map((item) =>
          item.id === id ? { ...item, hidden: !isHidden } : item
        )
      );
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  useEffect(() => {
    fetchSortedContent();
  }, [contentType, currentPage]);

  const handleToggle = () => {
    setContentType((prev) => (prev === 'BlogPost' ? 'Comment' : 'BlogPost'));
    setCurrentPage(1); // Reset to the first page when toggling
  };

  const renderContent = () =>
    contentList.map((item) => (
      <div key={item.id} className="p-4 border rounded mb-4 bg-white shadow">
        <h3 className="text-lg font-bold">
          {contentType === 'BlogPost' ? item.title : item.text}
        </h3>
        <p>
          <strong>Reports:</strong> {item.reportCount}
        </p>
        {contentType === 'BlogPost' && (
          <p>
            <strong>Content:</strong> {item.content}
          </p>
        )}
        <p>
          <strong>Status:</strong>{' '}
          <span className={item.hidden ? 'text-red-500' : 'text-green-500'}>
            {item.hidden ? 'Hidden' : 'Visible'}
          </span>
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => toggleVisibility(item.id, item.hidden)}
            className={`px-2 py-1 text-sm ${
              item.hidden ? 'bg-green-500' : 'bg-red-500'
            } text-white rounded`}
          >
            {item.hidden ? 'Unhide' : 'Hide'}
          </button>
        </div>
      </div>
    ));

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Reports</h1>
        <div className="mb-4">
          <button
            onClick={handleToggle}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View {contentType === 'BlogPost' ? 'Comments' : 'Blog Posts'}
          </button>
        </div>
        {contentList.length > 0 ? (
          <div>{renderContent()}</div>
        ) : (
          <p className="text-gray-500">No reported {contentType.toLowerCase()}s found.</p>
        )}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;

