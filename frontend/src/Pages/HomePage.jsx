import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/blogs");
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error("❌ Error fetching blogs:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedBlog) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/blogs/${selectedBlog._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      setBlogs(blogs.filter((blog) => blog._id !== selectedBlog._id));
      setShowModal(false);
      setSelectedBlog(null);
    } catch (error) {
      console.error("❌ Error deleting blog:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-3xl font-extrabold text-gray-800">BlogSphere</h1>
        <button
          className="bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
          onClick={() => navigate("/create-new-blog")}
        >
          Create New Blog
        </button>
      </header>

      {/* Hero Section */}
      <section className="text-center py-24 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <h2 className="text-5xl font-extrabold mb-4">Welcome to BlogSphere</h2>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed">
          Dive into a world of insightful articles and expert opinions.
        </p>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 px-8">
        <h3 className="text-4xl font-bold text-gray-800 text-center mb-10">
          Latest Blogs
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300"
              >
                <h4 className="text-2xl font-semibold text-gray-800">
                  {blog.title}
                </h4>
                <p className="text-gray-600 mt-3">
                  {blog.content.substring(0, 100)}...
                </p>
                <div className="mt-5 flex gap-4">
                  <button
                    className="text-orange-500 font-semibold hover:underline"
                    onClick={() => navigate(`/blog/${blog._id}`)}
                  >
                    Read More →
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300 shadow-md"
                    onClick={() => {
                      setSelectedBlog(blog);
                      setShowModal(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 text-lg">No blogs found.</p>
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold text-gray-800">Delete Blog</h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete this blog?
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p>
          &copy; {new Date().getFullYear()} BlogSphere. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
