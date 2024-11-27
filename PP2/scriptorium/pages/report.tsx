import { useRouter } from "next/router";
import React, { useState } from "react";

const ReportPage: React.FC = () => {
  const router = useRouter();
  const { contentType, blogPostId, commentId } = router.query;
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          contentType,
          explanation,
          blogPostId: contentType === "BlogPost" ? Number(blogPostId) : null,
          commentId: contentType === "Comment" ? Number(commentId) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit report.");
      }

      alert("Report submitted successfully.");
      router.push(`/blog/${blogPostId || ""}`);
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Report Content</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full border p-2 rounded mb-4"
            rows={5}
            placeholder="Explain why this content is inappropriate..."
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportPage;
