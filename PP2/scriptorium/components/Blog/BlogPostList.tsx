import React from 'react';
import { useRouter } from 'next/router';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  author?: {
    firstName?: string;
    lastName?: string;
  };
  tags?: { name: string }[];
  codeTemplates?: { name: string }[];
}

interface BlogPostListProps {
  posts?: BlogPost[];
}

const BlogPostList: React.FC<BlogPostListProps> = ({ posts = [] }) => {
  const router = useRouter();

  if (posts.length === 0) {
    return <p className="text-gray-500">No blog posts available.</p>;
  }

  const truncateContent = (content: string, limit: number) => {
    return content.length > limit ? `${content.substring(0, limit)}...` : content;
  };

  return (
    <ul className="space-y-4">
      {posts.map((post) => (
        <li key={post.id} className="p-4 border rounded shadow">
          <h3 className="text-xl font-semibold">{post.title}</h3>
          <p className="text-sm text-gray-500">
            {post.author
              ? `By ${post.author.firstName || 'Unknown'} ${post.author.lastName || 'Author'} on `
              : 'By Unknown Author on '}
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <p className="mt-2">{truncateContent(post.content, 300)}</p>
          <div className="mt-4 flex justify-between items-center">
            <button
              className="text-blue-500 hover:underline"
              onClick={() => router.push(`/blog/${post.id}`)}
            >
              Read More
            </button>
            <div className="flex space-x-4">
              <span className="flex items-center text-green-500">
              ➕ {post.upvotes}
              </span>
              <span className="flex items-center text-red-500">
              ➖ {post.downvotes}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BlogPostList;




