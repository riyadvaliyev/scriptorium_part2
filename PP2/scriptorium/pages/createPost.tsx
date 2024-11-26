import React, { useState, useEffect } from "react";
import Navbar from "../components/Shared/Navbar";
import BlogPostForm from "../components/Dashboard/BlogPostForm"; // Ensure the path to BlogPostForm is correct
import { useRouter } from "next/router";

const CreatePost: React.FC = () => {
  const [availableTemplates, setAvailableTemplates] = useState<
    { id: number; title: string }[]
  >([]);
  const router = useRouter();

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
        setAvailableTemplates(data.data || []); // Adjust based on your API structure
      } catch (err) {
        console.error("Error fetching code templates:", err);
      }
    };

    fetchTemplates();
  }, []);

  const handleCreatePost = async (data: any) => {
    try {
      const blogData = { ...data, codeTemplateIds: data.codeTemplateLinks }; // Map the data correctly

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
        console.error("Backend Response:", errorData); // Log backend errors
        throw new Error(errorData.error || "Failed to create blog post");
      }

      // Redirect to dashboard after successful creation
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error creating post:", err);
      alert(err.message || "Failed to create the post. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Create Blog Post</h1>
        <div className="bg-white p-6 rounded shadow">
          <BlogPostForm
            onSubmit={handleCreatePost}
            availableTemplates={availableTemplates} // Pass available templates to BlogPostForm
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

