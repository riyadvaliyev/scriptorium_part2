import React, { useEffect, useState } from 'react';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  authorId: string;
}

const BlogPostsSection: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog/getPosts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();
        // If needed, filter by userId here:
        const userId = localStorage.getItem('userId');
        const userPosts = data.filter((post: BlogPost) => post.authorId === userId);
        setBlogPosts(userPosts);
      } catch (err) {
        setError('Failed to load blog posts.');
      }
    };

    fetchBlogPosts();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="my-6">
      <h2 className="text-2xl font-bold mb-4">My Blog Posts</h2>
      {blogPosts.length === 0 ? (
        <p className="text-gray-500">No blog posts available. Create one now!</p>
      ) : (
        <ul className="space-y-4">
          {blogPosts.map((post) => (
            <li key={post.id} className="p-4 border rounded shadow">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-500">Created on: {new Date(post.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogPostsSection;



