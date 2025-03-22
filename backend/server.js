require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Fix CORS Issue
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

// ✅ Fix "Payload Too Large" Error
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define Blog Model
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String,
  image: String
});

const Blog = mongoose.model("Blog", blogSchema);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the Blog API!");
});

app.post("/api/blogs", async (req, res) => {
    try {
      const { title, author, content, image } = req.body;
  
      // ✅ Check if all fields exist
      if (!title || !author || !content) {
        return res.status(400).json({ error: "Title, author, and content are required" });
      }
  
      const newBlog = new Blog({ title, author, content, image });
      await newBlog.save();
      res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  
    } catch (error) {
      console.error("❌ Error creating blog:", error);
      res.status(500).json({ error: "Failed to create blog", details: error.message });
    }
  });
  

// ✅ Get All Blogs
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    console.error("❌ Error fetching blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ Update Blog by ID
app.put("/api/blogs/:id", async (req, res) => {
  try {
    const { content } = req.body;
    
    
    if (!content) {
      return res.status(400).json({ error: "Content is required for update" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id, 
      { content }, 
      { new: true } 
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(updatedBlog);
  } catch (error) {
    console.error("❌ Error updating blog:", error);
    res.status(500).json({ error: "Failed to update blog" });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting blog:", error);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});


// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
