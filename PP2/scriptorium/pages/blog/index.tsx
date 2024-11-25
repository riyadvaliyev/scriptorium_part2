import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Shared/Navbar';
import BlogPostList from '@//components/Blog/BlogPostList';
import BlogSortOptions from '@//components/Blog/BlogSortOptions';
import BlogSearchBar from '@/components/Blog/BlogSearchBar';
import BlogPagination from '@//components/Blog/BlogPagination';

// Define the BlogPost type
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

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch all posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/blog/getPosts`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        console.log('Fetched Posts:', data.posts);
        setPosts(data.posts as BlogPost[]);
        setFilteredPosts(data.posts as BlogPost[]);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  // Handle search
  useEffect(() => {
    const applySearchFilter = () => {
      const filtered = posts.filter((post) =>
        [post.title, post.content, ...(post.tags || []).map((tag) => tag.name), ...(post.codeTemplates || []).map((template) => template.name)]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
      setCurrentPage(1); // Reset to the first page
    };
    applySearchFilter();
  }, [searchTerm, posts]);

  // Handle sorting
  const applySorting = (items: BlogPost[]) => {
    if (sortOption === 'most_controversial') {
      return items.sort((a, b) => b.downvotes - a.downvotes || a.upvotes - b.upvotes);
    } else if (sortOption === 'most_valued') {
      return items.sort((a, b) => b.upvotes - a.upvotes || a.downvotes - b.downvotes);
    }
    return items;
  };

  // Paginate filtered and sorted posts
  const paginatedPosts = applySorting(filteredPosts).slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
        <BlogSearchBar onSearchChange={setSearchTerm} />
        <BlogSortOptions onSortChange={setSortOption} />
        <BlogPostList posts={paginatedPosts} />
        <BlogPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredPosts.length / pageSize)}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default Blog;


// const Blog: React.FC = () => {
//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto p-6">
//         <h1>Blog Page Placeholder</h1>
//       </div>
//     </>
//   );
// };

// export default Blog;