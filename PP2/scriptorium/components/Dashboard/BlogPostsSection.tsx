// everything in this project was done with the help of chatGPT. ai was extensively used in the code writing.

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BlogSearchBar from '@/components/Blog/BlogSearchBar';
import BlogPagination from '@/components/Blog/BlogPagination';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  hidden: boolean;
  authorId: number;
}

const BlogPostsSection: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const router = useRouter();

  const postsPerPage = 5;

  // Delete blog post
  const handleDelete = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch('/api/blog/deletePost', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete blog post.');
      }

      setBlogPosts((prev) => prev.filter((post) => post.id !== postId));
      alert('Blog post deleted successfully.');
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Failed to delete blog post. Please try again.');
    }
  };

  // Fetch blog posts on mount
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No access token found. Please log in again.');

        const response = await fetch('/api/blog/getPosts', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorDetails = await response.text();
          console.error('API Error Details:', errorDetails);
          throw new Error('Failed to fetch blog posts.');
        }

        const data = await response.json();
        const userId = parseInt(localStorage.getItem('userId') || '0', 10);
        const userPosts = data.posts.filter((post: BlogPost) => post.authorId === userId);

        setBlogPosts(userPosts);
        setFilteredPosts(userPosts); // Set filtered posts to initially match all posts
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts.');
      }
    };

    fetchBlogPosts();
  }, []);

  // Apply search filter
  useEffect(() => {
    const filtered = blogPosts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to page 1 on new search
  }, [searchTerm, blogPosts]);

  // Paginated posts
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="my-6">
      {/* <h2 className="text-2xl font-bold mb-4">My Blog Posts</h2> */}
      <BlogSearchBar onSearchChange={setSearchTerm} />

      {paginatedPosts.length === 0 ? (
        <p className="text-gray-500">No blog posts found. Create one now!</p>
      ) : (
        <ul className="space-y-4">
          {paginatedPosts.map((post) => (
            <li key={post.id} className="p-4 border rounded shadow">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-500">
                Created on: {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={post.hidden ? 'text-red-500' : 'text-green-500'}>
                  {post.hidden ? 'Hidden' : 'Visible'}
                </span>
              </p>
              <div className="mt-2 space-x-4">
                {!post.hidden && (
                  <button
                    onClick={() => router.push(`/editPost/${post.id}`)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <BlogPagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredPosts.length / postsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default BlogPostsSection;
