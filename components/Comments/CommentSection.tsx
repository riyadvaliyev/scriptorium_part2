

import React, { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import { useRouter } from 'next/router';

interface Comment {
  id: number;
  text: string;
  upvotes: number;
  parentId: number;
  downvotes: number;
  createdAt: string;
  hidden: boolean;
  author: {
    firstName: string;
    lastName: string;
    id: number;
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
  const router = useRouter();

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comment/listByRating?postId=${postId}`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
  
      const userRole = localStorage.getItem("userRole");
      const userId = parseInt(localStorage.getItem("userId") || "0", 10);
  
      const filterComments = (comments: Comment[]): Comment[] => {
        const commentsMap = new Map<number, Comment>();
        const topLevelComments: Comment[] = [];
  
        // Initialize comments in the map
        comments.forEach((comment) => {
          comment.replies = [];
          commentsMap.set(comment.id, comment);
        });
  
        // Populate replies and identify top-level comments
        comments.forEach((comment) => {
          if (comment.parentId) {
            const parent = commentsMap.get(comment.parentId);
            if (parent) parent.replies.push(comment);
          } else {
            topLevelComments.push(comment);
          }
        });
  
        // Filter based on `hidden` and `userRole`
        const recursiveFilter = (comments: Comment[]): Comment[] =>
          comments
            .filter(
              (comment) =>
                userRole === "ADMIN" ||
                !comment.hidden ||
                comment.author.id === userId // Include hidden comments if the user authored them
            )
            .map((comment) => ({
              ...comment,
              replies: recursiveFilter(comment.replies), // Recursively filter replies
            }));
  
        return recursiveFilter(topLevelComments);
      };
  
      const filteredComments = filterComments(data.data || []);
      setComments(filteredComments);
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
  
      // Recursive function to update nested replies
      const updateNestedReplies = (replies: Comment[]): Comment[] => {
        return replies.map((reply) =>
          reply.id === updatedComment.id
            ? { ...reply, upvotes: updatedComment.upvotes, downvotes: updatedComment.downvotes }
            : { ...reply, replies: updateNestedReplies(reply.replies) }
        );
      };
  
      // Update the specific comment/reply in the state
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === updatedComment.id
            ? { ...comment, upvotes: updatedComment.upvotes, downvotes: updatedComment.downvotes }
            : { ...comment, replies: updateNestedReplies(comment.replies) }
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
              <button
                className="text-blue-500 font-bold ml-4"
                onClick={() =>
                  router.push({
                    pathname: "/report",
                    query: { contentType: "Comment", commentId: reply.id },
                  })
                }
              >
                Report
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
        const commentLabel = `${index + 1}`;
  
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
              <button
                className="text-blue-500 font-bold ml-4"
                onClick={() =>
                  router.push({
                    pathname: "/report",
                    query: { contentType: "Comment", commentId: comment.id },
                  })
                }
              >
                Report
              </button>
            </div>
  
            {isAuthenticated && (
              <CommentForm
                onSubmit={addCommentOrReply}
                parentId={comment.id}
                placeholder={`Write your reply to Comment ${commentLabel}...`}
              />
            )}
  
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
