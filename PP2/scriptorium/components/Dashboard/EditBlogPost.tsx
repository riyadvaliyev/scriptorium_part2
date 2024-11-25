import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BlogPostForm from "@/components/Dashboard/BlogPostForm";

const EditBlogPost: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/blog/getPost/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch the blog post.");
        }

        const data = await response.json();
        setInitialData(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load the blog post.");
      }
    };

    fetchBlogPost();
  }, [id]);

  const handleEditPost = async (data: any) => {
    try {
      const response = await fetch(`/api/blog/editPost/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update the blog post.");
      }

      router.push("/dashboard"); // Redirect to dashboard after success
    } catch (err) {
      console.error(err);
      alert("Failed to update the blog post. Please try again.");
    }
  };

  if (!initialData) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Blog Post</h1>
      <BlogPostForm onSubmit={handleEditPost} initialData={initialData} />
    </div>
  );
};

export default EditBlogPost;
