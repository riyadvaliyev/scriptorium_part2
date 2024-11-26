import React, { useState, useEffect } from "react";

interface BlogPostFormProps {
  onSubmit: (data: BlogPostData) => void;
  initialData?: BlogPostData;
}

interface BlogPostData {
  title: string;
  content: string;
  tags: string;
  codeTemplateLinks: string[]; // Array of linked template IDs
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [tags, setTags] = useState(initialData?.tags || "");
  const [codeTemplateLinks, setCodeTemplateLinks] = useState<string[]>(initialData?.codeTemplateLinks || []);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    const formattedTags = tags.split(",").map((tag) => tag.trim());
    onSubmit({ title, content, tags: formattedTags.join(","), codeTemplateLinks });
  };

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
          Code Templates (Select Multiple)
        </label>
        <select
          id="codeTemplates"
          multiple
          value={codeTemplateLinks}
          onChange={(e) =>
            setCodeTemplateLinks(Array.from(e.target.selectedOptions, (option) => option.value))
          }
          className="w-full p-2 border rounded"
        >
          {/* Replace this with dynamically fetched templates */}
          <option value="1">Template 1</option>
          <option value="2">Template 2</option>
        </select>
      </div>

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
