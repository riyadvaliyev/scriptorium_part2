import React, { useEffect, useState } from 'react';
import Navbar from '../components/Shared/Navbar';
import { useRouter } from 'next/router';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  upvotes: number;
}

interface Template {
  id: number;
  title: string;
  explanation: string;
  language: string;
}

const LandingPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        // Fetch top 3 blog posts
        const blogResponse = await fetch('/api/blog/getPosts');
        if (!blogResponse.ok) throw new Error('Failed to fetch blog posts');
        const blogData = await blogResponse.json();
        const sortedPosts = blogData.posts
          .sort((a: BlogPost, b: BlogPost) => b.upvotes - a.upvotes)
          .slice(0, 3);
        setBlogPosts(sortedPosts);

        // Fetch top 3 templates
        const templateResponse = await fetch('/api/templates/searchTemplate');
        if (!templateResponse.ok) throw new Error('Failed to fetch templates');
        const templateData = await templateResponse.json();
        const featuredTemplates = templateData.data
          .slice(0, 3); // Assuming no specific criteria; showing the first 3
        setTemplates(featuredTemplates);
      } catch (error) {
        console.error('Error fetching featured content:', error);
      }
    };

    fetchFeaturedContent();
  }, []);

  return (
    <div>
      {/* Navigation Bar */}
      <Navbar />

      {/* Welcome Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">Welcome to Scriptorium</h1>
          <p className="text-xl mt-2">Where ideas come alive in code and words</p>
        </div>
      </div>

      {/* Featured Section */}
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-semibold mb-4 text-center">Featured Content</h2>

        {/* Blog Posts Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-3">Top Blog Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 bg-white shadow rounded hover:shadow-lg transition"
                  onClick={() => router.push(`/blog/${post.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <h4 className="text-xl font-semibold">{post.title}</h4>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{post.content}</p>
                  <p className="mt-2 text-green-500 font-medium">Upvotes: {post.upvotes}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No blog posts available to feature.</p>
            )}
          </div>
          <div className="text-center mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => router.push('/blog')}
            >
              Explore More Blog Posts
            </button>
          </div>
        </div>

        {/* Templates Section */}
        <div>
          <h3 className="text-2xl font-bold mb-3">Top Code Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.length > 0 ? (
              templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 bg-white shadow rounded hover:shadow-lg transition"
                  onClick={() => router.push('/templates')}
                  style={{ cursor: 'pointer' }}
                >
                  <h4 className="text-xl font-semibold">{template.title}</h4>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{template.explanation}</p>
                  <p className="mt-2 text-blue-500 font-medium">Language: {template.language}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No code templates available to feature.</p>
            )}
          </div>
          <div className="text-center mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => router.push('/templates')}
            >
              Explore More Code Templates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;


