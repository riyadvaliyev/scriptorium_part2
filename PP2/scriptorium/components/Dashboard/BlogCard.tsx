// src/components/BlogCard.tsx
import React from 'react';
import Link from 'next/link';

interface BlogCardProps {
  id: number;
  title: string;
  description: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  author: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ id, title, description, tags, upvotes, downvotes, author }) => {
  return (
    <div className="p-4 border rounded shadow hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold">
        <Link href={`/blog/${id}`} className="hover:underline">
          {title}
        </Link>
      </h2>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, idx) => (
          <span key={idx} className="px-2 py-1 text-xs bg-gray-200 rounded">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Author: {author}</span>
        <span>
          {upvotes} Upvotes / {downvotes} Downvotes
        </span>
      </div>
    </div>
  );
};

export default BlogCard;
