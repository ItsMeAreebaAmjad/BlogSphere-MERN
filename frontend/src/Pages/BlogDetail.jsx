import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog");
        }
        const data = await response.json();
        setBlog(data);
        setUpdatedContent(data.content); 
      } catch (error) {
        console.error("❌ Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSave = async () => {
    try {
      
      let cleanedContent = updatedContent.trim();

      if (cleanedContent.startsWith("<p>") && cleanedContent.endsWith("</p>")) {
        cleanedContent = cleanedContent.slice(3, -4);
      }

      const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: cleanedContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to update blog");
      }

      const updatedBlog = await response.json();
      setBlog(updatedBlog);
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error updating blog:", error);
    }
  };

  if (!blog) {
    return (
      <p className="text-center text-gray-600 text-lg mt-10">Loading blog...</p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 flex justify-center items-center p-6">
      <div className="max-w-3xl w-full bg-white shadow-2xl rounded-xl p-8">
        {/* Back Button */}
        <button
          className="bg-gray-900 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-700 transition duration-300 mb-6 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* Blog Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 text-center">
          {blog.title}
        </h1>

        {/* Author Name */}
        <p className="text-gray-600 italic text-lg text-center mb-4">
          ✍ By:{" "}
          <span className="text-orange-500 font-semibold">
            {blog.author || "Unknown"}
          </span>
        </p>

        {/* Blog Image */}
        {blog.image && (
          <div className="flex justify-center mb-6">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-64 object-cover rounded-lg shadow-lg" // Reduced image height
            />
          </div>
        )}

        {/* Edit Blog Section */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Edit Blog</h2>
          {!isEditing && (
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </div>

        {/* Blog Content (Rich Text Editor) */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
          <ReactQuill
            value={updatedContent}
            onChange={setUpdatedContent}
            readOnly={!isEditing}
            theme="snow"
          />
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-4 flex justify-end">
            <button
              className="bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
