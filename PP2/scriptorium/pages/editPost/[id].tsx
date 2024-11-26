import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Shared/Navbar";
import BlogPostForm from "@/components/Dashboard/BlogPostForm";

const EditPost: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Blog post ID from the URL
  const [postDetails, setPostDetails] = useState<any>(null); // Store existing post details
  const [availableTemplates, setAvailableTemplates] = useState<
    { id: number; title: string }[]
  >([]);
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);

  // Fetch the blog post details
  useEffect(() => {
    if (!id) return;

    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`/api/blog/getPostById?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog post details.");
        }
        const data = await response.json();
        setPostDetails(data.post);
        setSelectedTemplates(data.post.codeTemplateLinks?.map((t: any) => t.id) || []);
        console.log(selectedTemplates);
      } catch (err) {
        console.error("Error fetching blog post details:", err);
      }
    };

    fetchPostDetails();
  }, [id]);

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
        setAvailableTemplates(data.data || []);
      } catch (err) {
        console.error("Error fetching code templates:", err);
      }
    };

    fetchTemplates();
  }, []);

  const handleEditPost = async (data: any) => {
    try {
      // Prepare the payload for editing the blog post
      const blogData = {
        ...data,
        postId: id, // Use the current post ID
        codeTemplateIds: selectedTemplates,
      };
      const response = await fetch("/api/blog/editPost", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed Response:", errorData);
        throw new Error("Failed to edit the blog post.");
      }

      router.push("/dashboard"); // Redirect to dashboard after successful edit
    } catch (err) {
      console.error("Error editing blog post:", err);
      alert("Failed to edit the blog post. Please try again.");
    }
  };

  if (!postDetails) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>
        <div className="bg-white p-6 rounded shadow">
          <BlogPostForm
            onSubmit={handleEditPost}
            availableTemplates={availableTemplates}
            initialData={{
              title: postDetails.title,
              content: postDetails.content,
              tags: postDetails.tags.map((tag: any) => tag.name).join(", "),
              codeTemplateLinks: selectedTemplates,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditPost;
