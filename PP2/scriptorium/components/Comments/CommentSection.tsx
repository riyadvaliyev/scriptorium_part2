// import React, { useEffect, useState } from "react";
// import CommentForm from "./CommentForm";

// interface Comment {
//   id: number;
//   text: string;
//   upvotes: number;
//   parentId: number;
//   downvotes: number;
//   createdAt: string;
//   author: {
//     firstName: string;
//     lastName: string;
//   };
//   replies: Comment[]; // Nested replies
// }

// interface CommentsSectionProps {
//   postId: number;
//   isAuthenticated: boolean;
// }

// const CommentSection: React.FC<CommentsSectionProps> = ({
//   postId,
//   isAuthenticated,
// }) => {
//   const [comments, setComments] = useState<Comment[]>([]);

//   const fetchComments = async () => {
//     try {
//       const response = await fetch(`/api/comment/listByRating?postId=${postId}`);
//       if (!response.ok) throw new Error("Failed to fetch comments");
//       const data = await response.json();
  
//       // Process comments to nest replies under their respective parent
//       const commentsMap = new Map<number, Comment>();
//       const topLevelComments: Comment[] = [];
  
//       (data.data || []).forEach((comment: Comment) => {
//         comment.replies = []; // Initialize replies array
//         commentsMap.set(comment.id, comment);
  
//         if (comment.parentId) {
//           // Add comment to its parent's replies
//           const parent = commentsMap.get(comment.parentId);
//           if (parent) parent.replies.push(comment);
//         } else {
//           // Top-level comment
//           topLevelComments.push(comment);
//         }
//       });
  
//       setComments(topLevelComments);
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//     }
//   };
  

//   const addCommentOrReply = async (text: string, parentId?: number) => {
//     try {
//       const response = await fetch(`/api/comment/addReply`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//         body: JSON.stringify({ postId, text, parentId }),
//       });

//       if (!response.ok) throw new Error("Failed to add comment or reply");

//       fetchComments(); // Refresh comments after adding
//     } catch (error) {
//       console.error("Error adding comment or reply:", error);
//     }
//   };

//   useEffect(() => {
//     fetchComments();
//   }, []);

//   // const renderReplies = (replies: Comment[], parentLabel: string) => (
//   //   <div className="mt-4 ml-4">
//   //     {replies.map((reply, index) => {
//   //       const replyLabel = `${parentLabel}.${index + 1}`; // Generate hierarchical numbering
//   //       return (
//   //         <div key={reply.id} className="p-2 border-b last:border-none">
//   //           <p className="font-bold text-sm text-gray-700">
//   //             Reply {replyLabel} to {parentLabel}
//   //           </p>
//   //           <p className="font-medium">
//   //             {reply.author.firstName} {reply.author.lastName}
//   //           </p>
//   //           <p className="text-sm text-gray-500">
//   //             {new Date(reply.createdAt).toLocaleDateString()}
//   //           </p>
//   //           <p className="mt-2">{reply.text}</p>
  
//   //           {isAuthenticated && (
//   //             <CommentForm
//   //               onSubmit={addCommentOrReply}
//   //               parentId={reply.id} // Pass the reply's ID for nested replies
//   //               placeholder={`Write your reply to Reply ${replyLabel}...`}
//   //             />
//   //           )}
  
//   //           {/* Recursively render replies */}
//   //           {reply.replies.length > 0 && renderReplies(reply.replies, replyLabel)}
//   //         </div>
//   //       );
//   //     })}
//   //   </div>
//   // );

//   const renderReplies = (replies: Comment[], parentLabel: string) => (
//     <div className="mt-4 ml-8">
//       {replies.map((reply, index) => {
//         const replyLabel = `${parentLabel}.${index + 1}`;
  
//         const handleCommentVote = async (commentId: number, ratingValue: number) => {
//           try {
//             const response = await fetch(`/api/rating/rateComment`, {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//               },
//               body: JSON.stringify({ commentId, ratingValue }),
//             });
        
//             if (!response.ok) throw new Error('Failed to vote on comment');
        
//             const updatedComment = await response.json();
//             console.log('Updated Comments:', updatedComment);
//             // Update the specific comment/reply in the state
//             setComments((prevComments) =>
//               prevComments.map((comment) =>
//                 comment.id === updatedComment.id
//                   ? { ...comment, upvotes: updatedComment.upvotes, downvotes: updatedComment.downvotes }
//                   : {
//                       ...comment,
//                       replies: comment.replies.map((reply) =>
//                         reply.id === updatedComment.id
//                           ? { ...reply, upvotes: updatedComment.upvotes, downvotes: updatedComment.downvotes }
//                           : reply
//                       ),
//                     }
//               )
//             );
//           } catch (error) {
//             console.error('Error voting on comment:', error);
//           }
//         };
        
        
  
//         return (
//           <div key={reply.id} className="p-2 border-b last:border-none">
//             <p className="font-bold text-sm text-gray-700">
//               Reply {replyLabel} to {parentLabel}
//             </p>
//             <p className="font-medium">
//               {reply.author.firstName} {reply.author.lastName}
//             </p>
//             <p className="text-sm text-gray-500">
//               {new Date(reply.createdAt).toLocaleDateString()}
//             </p>
//             <p className="mt-2">{reply.text}</p>
  
//             <div className="flex items-center mt-2">
//               <button
//                 className="text-green-600 font-bold mr-2"
//                 onClick={() => handleCommentVote(reply.id, 1)}
//               >
//                 + {reply.upvotes || 0} 
//               </button>
//               <button
//                 className="text-red-600 font-bold"
//                 onClick={() => handleCommentVote(reply.id, 0)}
//               >
//                 - {reply.downvotes || 0} 
//               </button>
//             </div>
  
//             {isAuthenticated && (
//               <CommentForm
//                 onSubmit={addCommentOrReply}
//                 parentId={reply.id}
//                 placeholder={`Write your reply to Reply ${replyLabel}...`}
//               />
//             )}
  
//             {reply.replies.length > 0 && renderReplies(reply.replies, replyLabel)}
//           </div>
//         );
//       })}
//     </div>
//   );
  
  

//   const renderComments = () => (
//     <>
//       {comments.map((comment, index) => {
//         const commentLabel = `${index + 1}`; // Top-level comment numbering
//         return (
//           <div key={comment.id} className="p-4 border-b last:border-none">
//             <p className="font-bold text-sm text-gray-700">Comment {commentLabel}</p>
//             <p className="font-medium">
//               {comment.author.firstName} {comment.author.lastName}
//             </p>
//             <p className="text-sm text-gray-500">
//               {new Date(comment.createdAt).toLocaleDateString()}
//             </p>
//             <p className="mt-2">{comment.text}</p>
  
//             {isAuthenticated && (
//               <CommentForm
//                 onSubmit={addCommentOrReply}
//                 parentId={comment.id} // Pass the comment ID for top-level replies
//                 placeholder={`Write your reply to Comment ${commentLabel}...`}
//               />
//             )}
  
//             {/* Render Replies */}
//             {comment.replies.length > 0 && renderReplies(comment.replies, commentLabel)}
//           </div>
//         );
//       })}
//     </>
//   );  

//   return (
//     <div className="mt-6">
//       <h2 className="text-2xl font-semibold mb-4">Comments</h2>

//       {isAuthenticated && (
//         <CommentForm onSubmit={addCommentOrReply} placeholder="Write your comment here..." />
//       )}

//       {comments.length > 0 ? (
//         renderComments()
//       ) : (
//         <p className="text-gray-500">No comments yet. Be the first to comment!</p>
//       )}
//     </div>
//   );
// };

// export default CommentSection;

import React, { useEffect, useState } from "react";
import CommentForm from "./CommentForm";

interface Comment {
  id: number;
  text: string;
  upvotes: number;
  parentId: number;
  downvotes: number;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
  };
  replies: Comment[]; // Nested replies
}

interface CommentsSectionProps {
  postId: number;
  isAuthenticated: boolean;
}

const CommentSection: React.FC<CommentsSectionProps> = ({
  postId,
  isAuthenticated,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comment/listByRating?postId=${postId}`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();

      // Process comments to nest replies under their respective parent
      const commentsMap = new Map<number, Comment>();
      const topLevelComments: Comment[] = [];

      (data.data || []).forEach((comment: Comment) => {
        comment.replies = []; // Initialize replies array
        commentsMap.set(comment.id, comment);

        if (comment.parentId) {
          // Add comment to its parent's replies
          const parent = commentsMap.get(comment.parentId);
          if (parent) parent.replies.push(comment);
        } else {
          // Top-level comment
          topLevelComments.push(comment);
        }
      });

      setComments(topLevelComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentVote = async (commentId: number, ratingValue: number) => {
    try {
      const response = await fetch(`/api/rating/rateComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ commentId, ratingValue }),
      });

      if (!response.ok) throw new Error("Failed to vote on comment");

      const updatedComment = await response.json();
      console.log("Updated Comments:", updatedComment);

      // Update the specific comment/reply in the state
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === updatedComment.id
            ? { ...comment, upvotes: updatedComment.upvotes, downvotes: updatedComment.downvotes }
            : {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === updatedComment.id
                    ? { ...reply, upvotes: updatedComment.upvotes, downvotes: updatedComment.downvotes }
                    : reply
                ),
              }
        )
      );
    } catch (error) {
      console.error("Error voting on comment:", error);
    }
  };

  const addCommentOrReply = async (text: string, parentId?: number) => {
    try {
      const response = await fetch(`/api/comment/addReply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ postId, text, parentId }),
      });

      if (!response.ok) throw new Error("Failed to add comment or reply");

      fetchComments(); // Refresh comments after adding
    } catch (error) {
      console.error("Error adding comment or reply:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const renderReplies = (replies: Comment[], parentLabel: string) => (
    <div className="mt-4 ml-8">
      {replies.map((reply, index) => {
        const replyLabel = `${parentLabel}.${index + 1}`;

        return (
          <div key={reply.id} className="p-2 border-b last:border-none">
            <p className="font-bold text-sm text-gray-700">
              Reply {replyLabel} to {parentLabel}
            </p>
            <p className="font-medium">
              {reply.author.firstName} {reply.author.lastName}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(reply.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-2">{reply.text}</p>

            <div className="flex items-center mt-2">
              <button
                className="text-green-600 font-bold mr-2"
                onClick={() => handleCommentVote(reply.id, 1)}
              >
                + {reply.upvotes || 0}
              </button>
              <button
                className="text-red-600 font-bold"
                onClick={() => handleCommentVote(reply.id, 0)}
              >
                - {reply.downvotes || 0}
              </button>
            </div>

            {isAuthenticated && (
              <CommentForm
                onSubmit={addCommentOrReply}
                parentId={reply.id}
                placeholder={`Write your reply to Reply ${replyLabel}...`}
              />
            )}

            {reply.replies.length > 0 && renderReplies(reply.replies, replyLabel)}
          </div>
        );
      })}
    </div>
  );

  const renderComments = () => (
    <>
      {comments.map((comment, index) => {
        const commentLabel = `${index + 1}`; // Top-level comment numbering
        return (
          <div key={comment.id} className="p-4 border-b last:border-none">
            <p className="font-bold text-sm text-gray-700">Comment {commentLabel}</p>
            <p className="font-medium">
              {comment.author.firstName} {comment.author.lastName}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-2">{comment.text}</p>

            <div className="flex items-center mt-2">
              <button
                className="text-green-600 font-bold mr-2"
                onClick={() => handleCommentVote(comment.id, 1)}
              >
                + {comment.upvotes || 0}
              </button>
              <button
                className="text-red-600 font-bold"
                onClick={() => handleCommentVote(comment.id, 0)}
              >
                - {comment.downvotes || 0}
              </button>
            </div>

            {isAuthenticated && (
              <CommentForm
                onSubmit={addCommentOrReply}
                parentId={comment.id}
                placeholder={`Write your reply to Comment ${commentLabel}...`}
              />
            )}

            {/* Render Replies */}
            {comment.replies.length > 0 && renderReplies(comment.replies, commentLabel)}
          </div>
        );
      })}
    </>
  );

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>

      {isAuthenticated && (
        <CommentForm onSubmit={addCommentOrReply} placeholder="Write your comment here..." />
      )}

      {comments.length > 0 ? (
        renderComments()
      ) : (
        <p className="mt-4 text-gray-500">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default CommentSection;
