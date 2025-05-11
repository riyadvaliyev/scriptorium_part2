import React, { useState, useEffect } from "react";
import CodeTemplateSelector from "./CodeTemplateSelector"; // Ensure this path is correct

interface BlogPostFormProps {
  onSubmit: (data: BlogPostData) => void;
  initialData?: BlogPostData;
  availableTemplates: { id: number; title: string }[]; // Templates passed from the parent
  additionalFields?: React.ReactNode; // Optional additional fields for customization
}

interface BlogPostData {
  title: string;
  content: string;
  tags: string;
  codeTemplateLinks: number[]; // Array of linked template IDs
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({
  onSubmit,
  initialData,
  availableTemplates,
  additionalFields, // Optional fields passed from the parent
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [tags, setTags] = useState(initialData?.tags || "");
  const [codeTemplateLinks, setCodeTemplateLinks] = useState<number[]>(
    initialData?.codeTemplateLinks || []
  );
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    // Format tags for submission
    const formattedTags = tags.split(",").map((tag) => tag.trim());
    onSubmit({
      title,
      content,
      tags: formattedTags.join(","),
      codeTemplateLinks,
    });
  };

  // Sync state with `initialData` when it changes (useful for edit functionality)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      setTags(initialData.tags || "");
      setCodeTemplateLinks(initialData.codeTemplateLinks || []);
    }
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-2 border rounded"
          rows={5}
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium">
          Tags (comma-separated)
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., JavaScript, React, Blog"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="codeTemplates" className="block text-sm font-medium">
          Code Templates
        </label>
        <CodeTemplateSelector
          templates={availableTemplates}
          onSelectionChange={(selectedIds) => setCodeTemplateLinks(selectedIds)}
        />
      </div>

      {/* Render additional fields if provided */}
      {additionalFields && <div>{additionalFields}</div>}

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default BlogPostForm;
