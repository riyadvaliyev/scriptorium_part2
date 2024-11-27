import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  hidden: boolean;
  authorId: number; // Filtering by author ID if needed
}

const BlogPostsSection: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  // Delete blog post
  const handleDelete = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch("/api/blog/deletePost", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete blog post.");
      }

      // Update state to remove the deleted post
      setBlogPosts((prev) => prev.filter((post) => post.id !== postId));
      alert("Blog post deleted successfully.");
    } catch (error) {
      console.error("Error deleting blog post:", error);
      alert("Failed to delete blog post. Please try again.");
    }
  };

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No access token found. Please log in again.');
        }
    
        const response = await fetch('/api/blog/getPosts', {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        if (!response.ok) {
          const errorDetails = await response.text();
          console.error('API Error Details:', errorDetails);
          throw new Error('Failed to fetch blog posts.');
        }
    
        const data = await response.json();
        
        // Filter by authorId if needed
        const userId = parseInt(localStorage.getItem('userId') || '0', 10);
        const blogPosts = data.posts.filter((post: BlogPost) => post.authorId === userId);
        
        setBlogPosts(blogPosts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts.');
      }
    };
    
    fetchBlogPosts();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="my-6">
      {blogPosts.length === 0 ? (
        <p className="text-gray-500">No blog posts available. Create one now!</p>
      ) : (
        <ul className="space-y-4">
          {blogPosts.map((post) => (
            <li key={post.id} className="p-4 border rounded shadow">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-500">Created on: {new Date(post.createdAt).toLocaleDateString()}</p>
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
                {/* <button
                  onClick={() => router.push(`/editPost/${post.id}`)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button> */}
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
    </div>
  );
};

export default BlogPostsSection;







 