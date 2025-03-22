import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateNewBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [successPopup, setSuccessPopup] = useState(false);
  const navigate = useNavigate();

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const blogData = {
      title,
      author,
      content,
      image,
    };

    try {
      const response = await fetch("http://localhost:5000/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        setSuccessPopup(true); 
      } else {
        console.error("❌ Error from backend:", data);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-xl p-8 max-w-2xl w-full transform transition">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Create a New Blog
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold">Title</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-orange-500 transition"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-gray-700 font-semibold">Author</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-orange-500 transition"
              placeholder="Enter your name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-semibold">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
              onChange={handleImageUpload}
            />
            {image && (
              <div className="mt-4 flex justify-center">
                <img
                  src={image}
                  alt="Blog Preview"
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-gray-700 font-semibold">Content</label>
            <textarea
              rows="6"
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-orange-500 transition"
              placeholder="Write your blog content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Publish Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white p-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition duration-300"
          >
            Publish Blog
          </button>
        </form>
      </div>

      {/* ✅ Success Popup */}
      {successPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold text-green-600">🎉 Blog Created Successfully!</h3>
            <p className="text-gray-700 mt-2">Your blog has been published.</p>
            <button
              className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
              onClick={() => {
                setSuccessPopup(false);
                navigate("/"); 
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNewBlog;
