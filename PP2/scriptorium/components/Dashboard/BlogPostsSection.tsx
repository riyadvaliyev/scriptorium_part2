import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  authorId: number; // Filtering by author ID if needed
}

const BlogPostsSection: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

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
    
        console.log('API Response Data:', data);
    
        // Filter by authorId if needed
        const userId = parseInt(localStorage.getItem('userId') || '0', 10);
        console.log('User ID from localStorage:', userId);
        const blogPosts = data.posts.filter((post: BlogPost) => post.authorId === userId);
        
        console.log('Blog posts state:', blogPosts);

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
              <div className="mt-2 space-x-4">
                <button
                  onClick={() => router.push(`/editPost/${post.id}`)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
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







 