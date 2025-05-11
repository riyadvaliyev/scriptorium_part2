import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BlogPostForm from "@/components/Dashboard/BlogPostForm";

const CreateBlogPost: React.FC = () => {
  const router = useRouter();
  const [availableTemplates, setAvailableTemplates] = useState<
    { id: number; title: string }[]
  >([]);
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);

  // Fetch available code templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/templates/searchTemplate", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch code templates.");
        }

        const data = await response.json();
        setAvailableTemplates(data.data || []); // Assuming the API response contains a "data" field with templates
      } catch (err) {
        console.error("Error fetching code templates:", err);
      }
    };

    fetchTemplates();
  }, []);

  const handleCreatePost = async (data: any) => {
    try {
      // Include selected templates in the blog post data
      const blogData = { ...data, codeTemplateIds: selectedTemplates };
      const response = await fetch("/api/blog/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed Response:", errorData); // Debug: Log backend error
        throw new Error("Failed to create the blog post.");
      }

      router.push("/dashboard"); // Redirect to dashboard after success
    } catch (err) {
      console.error("Error creating blog post:", err); // Debug: Catch and log errors
      alert("Failed to create the blog post. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Blog Post</h1>
      <BlogPostForm
        onSubmit={handleCreatePost}
        availableTemplates={availableTemplates} // Pass templates to BlogPostForm
        additionalFields={
          <div className="mb-4">
            <label
              htmlFor="codeTemplates"
              className="block font-semibold mb-1"
            >
              Code Templates
            </label>
            <select
              id="codeTemplates"
              multiple
              value={selectedTemplates.map((id) => id.toString())} // Convert to string for compatibility
              onChange={(e) =>
                setSelectedTemplates(
                  Array.from(e.target.selectedOptions, (opt) => parseInt(opt.value))
                )
              }
              className="w-full p-2 border rounded"
            >
              {availableTemplates.length > 0 ? (
                availableTemplates.map((template) => (
                  <option key={template.id} value={template.id.toString()}>
                    {template.title}
                  </option>
                ))
              ) : (
                <option disabled>No templates available</option>
              )}
            </select>
          </div>
        }
      />
    </div>
  );
};

export default CreateBlogPost;
