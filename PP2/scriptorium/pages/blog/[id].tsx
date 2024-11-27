// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import Navbar from '@/components/Shared/Navbar'; // Assuming Navbar path
// import CommentsSection from '@/components/Comments/CommentSection';

// interface BlogPost {
//   id: number;
//   title: string;
//   content: string;
//   createdAt: string;
//   tags?: { name: string }[];
//   codeTemplateLinks?: { id: number; title: string; link?: string }[];
//   author?: {
//     firstName?: string;
//     lastName?: string;
//   };
// }

// const BlogPostDetail: React.FC = () => {
//   const router = useRouter();
//   const { id } = router.query;
//   const [post, setPost] = useState<BlogPost | null>(null);

//   useEffect(() => {
//     if (!id) return;

//     const fetchPost = async () => {
//       try {
//         const response = await fetch(`/api/blog/getPostById?id=${id}`);
//         if (!response.ok) throw new Error('Failed to fetch post');
//         const data = await response.json();
//         setPost(data.post);
//       } catch (error) {
//         console.error('Error fetching post:', error);
//       }
//     };

//     fetchPost();
//   }, [id]);

//   if (!post) return <p className="text-center mt-4">Loading...</p>;

//   return (
//     <div>
//       <Navbar />
//       <div className="container mx-auto p-6">
//         <h1 className="text-4xl font-bold text-blue-600 mb-4">{post.title}</h1>
//         <p className="text-gray-500 mb-2">
//           By <span className="font-medium">{post.author?.firstName || 'Unknown'} {post.author?.lastName || 'Author'}</span> on {new Date(post.createdAt).toLocaleDateString()}
//         </p>
//         <div className="mb-6">
//           {post.tags?.map((tag) => (
//             <span key={tag.name} className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm mr-2">
//               {tag.name}
//             </span>
//           ))}
//         </div>
//         <div className="p-4 bg-gray-50 border rounded-lg shadow">
//           <p>{post.content}</p>
//         </div>
      //   <div className="mt-6 mb-6">
      //     <h2 className="text-2xl font-semibold mb-4">Code Templates</h2>
      //     <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      //       {post.codeTemplateLinks && post.codeTemplateLinks.length > 0 ? (
      //         post.codeTemplateLinks.map((template) => (
      //           <a
      //             key={template.id}
      //             href={template.link || '#'}
      //             target="_blank"
      //             rel="noopener noreferrer"
      //             className="block p-3 border rounded-md shadow-sm hover:shadow-md bg-blue-50 hover:bg-blue-100 transition-all"
      //           >
      //             <h3 className="text-sm font-medium text-blue-700 truncate">{template.title}</h3>
      //           </a>
      //         ))
      //       ) : (
      //         <p className="text-gray-500">No code templates linked to this blog post.</p>
      //       )}
      //     </div>
      //   </div>
      //   <CommentsSection postId={Number(id)} isAuthenticated={!!localStorage.getItem("accessToken")} />
      // </div>
//     </div>
//   );
// };

// export default BlogPostDetail;

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Shared/Navbar';
import CommentsSection from '@/components/Comments/CommentSection';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  tags?: { name: string }[];
  codeTemplateLinks?: { id: number; title: string; link?: string }[];
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

  const handlePostVote = async (ratingValue: number) => {
    try {
      const response = await fetch(`/api/rating/ratePost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ postId: id, ratingValue }),
      });

      if (!response.ok) throw new Error('Failed to vote on post');

      const updatedPost = await response.json();

      // Update the local post state
      setPost((prevPost) =>
        prevPost
          ? { ...prevPost, upvotes: updatedPost.upvotes, downvotes: updatedPost.downvotes }
          : null
      );
    } catch (error) {
      console.error('Error voting on post:', error);
    }
  };

  if (!post) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-2">
          By <span className="font-medium">{post.author?.firstName || 'Unknown'} {post.author?.lastName || 'Author'}</span> on {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div className="mb-6">
          {post.tags?.map((tag) => (
            <span key={tag.name} className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm mr-2">
              {tag.name}
            </span>
          ))}
        </div>
        <div className="p-4 bg-gray-50 border rounded-lg shadow">
          <p>{post.content}</p>
        </div>
        <div className="flex items-center mt-4">
          <button
            className="text-green-600 font-bold mr-2"
            onClick={() => handlePostVote(1)} // Upvote
          >
            + {post?.upvotes || 0}
          </button>
          <button
            className="text-red-600 font-bold"
            onClick={() => handlePostVote(0)} // Downvote
          >
            - {post?.downvotes || 0}
          </button>
          <button
            className="text-blue-500 font-bold ml-4"
            onClick={() =>
              router.push({
                pathname: "/report",
                query: { contentType: "BlogPost", blogPostId: post.id },
              })
            }
          >
            Report
          </button>
        </div>
        {/* Code Templates Section */}
        <div className="mt-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Code Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {post.codeTemplateLinks && post.codeTemplateLinks.length > 0 ? (
              post.codeTemplateLinks.map((template) => (
                <a
                  key={template.id}
                  href={`/editor/${template.id}` || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border rounded-md shadow-sm hover:shadow-md bg-blue-50 hover:bg-blue-100 transition-all"
                >
                  <h3 className="text-sm font-medium text-blue-700 truncate">{template.title}</h3>
                </a>
              ))
            ) : (
              <p className="text-gray-500">No code templates linked to this blog post.</p>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <CommentsSection postId={Number(id)} isAuthenticated={!!localStorage.getItem('accessToken')} />
      </div>
    </div>
  );
};

export default BlogPostDetail;
