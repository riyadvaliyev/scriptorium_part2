// src/components/Blog/BlogPostCard.tsx
import React from 'react';

interface BlogPostCardProps {
  title: string;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ title, content, createdAt, upvotes, downvotes }) => {
  return (
    <div className="p-4 border rounded shadow">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">Created on: {new Date(createdAt).toLocaleDateString()}</p>
      <p className="mt-2">{content}</p>
      <div className="flex mt-2 space-x-4 text-sm">
        <p>Upvotes: {upvotes}</p>
        <p>Downvotes: {downvotes}</p>
      </div>
    </div>
  );
};

export default BlogPostCard;
