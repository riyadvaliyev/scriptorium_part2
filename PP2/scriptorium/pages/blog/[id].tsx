// src/pages/blog/[id].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  tags?: { name: string }[];
  codeTemplates?: { name: string; link: string }[];
  author?: {
    firstName?: string;
    lastName?: string;
  };
}

const BlogPostDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/getPostById?id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        const data = await response.json();
        setPost(data.post);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-gray-500">
        By {post.author?.firstName || 'Unknown'} {post.author?.lastName || 'Author'} on{' '}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="mt-4">
        {post.tags?.map((tag) => (
          <span
            key={tag.name}
            className="px-2 py-1 bg-gray-200 rounded-full text-sm mr-2"
          >
            {tag.name}
          </span>
        ))}
      </div>
      <div className="mt-6">{post.content}</div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Code Templates</h2>
        {post.codeTemplates?.map((template) => (
          <a
            key={template.name}
            href={template.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {template.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default BlogPostDetail;



