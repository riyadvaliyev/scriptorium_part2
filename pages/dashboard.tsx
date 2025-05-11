// src/pages/dashboard.tsx
import React from 'react';
import Navbar from '../components/Shared/Navbar';
import ProfileSection from '../components/Dashboard/ProfileSection';
import BlogPostsSection from '../components/Dashboard/BlogPostsSection';
import TemplatesSection from '../components/Dashboard/TemplatesSection';
import Link from 'next/link';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Profile Section */}
        <section className="mb-12">
          <ProfileSection />
        </section>

        {/* Blog Posts and Templates Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Blog Posts Section */}
          <section className="p-4 border rounded shadow bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">My Blog Posts</h2>
              <Link href="/createPost">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Create Blog Post
                </button>
              </Link>
            </div>
            <BlogPostsSection />
          </section>

          {/* Templates Section */}
          <section className="p-4 border rounded shadow bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">My Templates</h2>
              <Link href="/editor">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Create Template
                </button>
              </Link>
            </div>
            <TemplatesSection />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;




