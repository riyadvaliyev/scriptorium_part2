// src/pages/createPost.tsx
import React, { useState } from 'react';
import Navbar from '../components/Shared/Navbar';
import { useRouter } from 'next/router';

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    // Split tags and map them to the required format
    const formattedTags = tags.split(',').map((tag) => ({ name: tag.trim() }));

    try {
      const response = await fetch('/api/blog/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          title,
          content,
          tags: formattedTags, // Use the formatted tags
          codeTemplateIds: [], // If you have template links, pass them here
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend Response:', errorData);
        throw new Error(errorData.error || 'Failed to create blog post');
      }

      const data = await response.json();
      // Reset the form
      setTitle('');
      setContent('');
      setTags('');
      setError('');
      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard'); // Redirect to the dashboard
      }, 2000);
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.message || 'Failed to create the post. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Create Blog Post</h1>
        <div className="bg-white p-6 rounded shadow">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">Post created successfully! Redirecting...</p>}
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full p-2 border rounded"
                rows={5}
              />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium">
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., JavaScript, React, Blog"
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
