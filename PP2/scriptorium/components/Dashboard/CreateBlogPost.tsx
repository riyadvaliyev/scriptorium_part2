import React from "react";
import { useRouter } from "next/router";
import BlogPostForm from "@/components/Dashboard/BlogPostForm";

const CreateBlogPost: React.FC = () => {
  const router = useRouter();

  const handleCreatePost = async (data: any) => {
    try {
      const response = await fetch("/api/blog/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create the blog post.");
      }

      router.push("/dashboard"); // Redirect to dashboard after success
    } catch (err) {
      console.error(err);
      alert("Failed to create the blog post. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Blog Post</h1>
      <BlogPostForm onSubmit={handleCreatePost} />
    </div>
  );
};

export default CreateBlogPost;
