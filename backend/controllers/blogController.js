const Blog = require("../models/blogModel");

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.create({
      title,
      content,
      user: req.user.id,
    });
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("user", "username");
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
