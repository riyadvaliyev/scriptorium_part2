// import React, { useState } from "react";

// interface CommentFormProps {
//   onSubmit: (text: string) => void;
// }

// const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
//   const [text, setText] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!text.trim()) return; // Prevent empty comments
//     onSubmit(text.trim());
//     setText(""); // Clear the input
//   };

//   return (
//     <form onSubmit={handleSubmit} className="mt-4">
//       <textarea
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         placeholder="Write your comment here..."
//         className="w-full p-2 border rounded"
//         rows={3}
//         required
//       ></textarea>
//       <button
//         type="submit"
//         className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//       >
//         Post Comment
//       </button>
//     </form>
//   );
// };

// export default CommentForm;

// CommentForm.tsx
import React, { useState } from "react";

interface CommentFormProps {
  onSubmit: (text: string, parentId?: number) => void;
  parentId?: number; // New optional prop
  placeholder?: string; // Optional for customizing placeholder
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  parentId,
  placeholder = "Write your comment here...",
}) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return; // Prevent empty comments
    onSubmit(text.trim(), parentId); // Pass parentId for replies
    setText(""); // Clear the input
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 border rounded"
        rows={3}
        required
      ></textarea>
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {parentId ? "Post Reply" : "Post Comment"}
      </button>
    </form>
  );
};

export default CommentForm;
