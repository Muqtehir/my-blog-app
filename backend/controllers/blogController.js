const Blog = require("../models/blogModel");

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, image, tags } = req.body;
    // Basic validation for empty fields
    if (!title || !content)
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    const blog = await Blog.create({
      title,
      content,
      user: req.user.id,
      image: image || null,
      tags: Array.isArray(tags)
        ? tags
        : typeof tags === "string" && tags
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    });
    res.status(201).json(blog);
  } catch (err) {
    if (err.name === "ValidationError") {
      // Mongoose validation error -> send 400 with details
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    res.status(500).json({ message: err.message });
  }
};

// Get All Blogs
exports.getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const search = req.query.search ? String(req.query.search).trim() : "";

    const filter = {};
    if (search) {
      const re = new RegExp(search, "i");
      filter.$or = [{ title: { $regex: re } }, { tags: { $in: [re] } }];
    }

    const total = await Blog.countDocuments(filter);
    const pages = Math.ceil(total / limit) || 1;
    const blogs = await Blog.find(filter)
      .populate("user", "username")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ blogs, page, pages, total });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    res.status(500).json({ message: err.message });
  }
};

// Get single Blog by id
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("user", "username")
      .populate("comments.user", "username");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    res.status(500).json({ message: err.message });
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.user.toString() !== req.user.id && !req.user.isAdmin)
      return res.status(403).json({ message: "Unauthorized" });

    // Validate incoming update fields if provided
    if ("title" in req.body && !req.body.title)
      return res.status(400).json({ message: "Title cannot be empty" });
    if ("content" in req.body && !req.body.content)
      return res.status(400).json({ message: "Content cannot be empty" });

    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    res.status(500).json({ message: err.message });
  }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.user.toString() !== req.user.id && !req.user.isAdmin)
      return res.status(403).json({ message: "Unauthorized" });

    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add comment to a blog (public)
exports.addComment = async (req, res) => {
  try {
    const { name, content } = req.body;
    if (!name || !content)
      return res
        .status(400)
        .json({ message: "Name and comment content are required" });

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = { name, content };
    if (req.user && req.user.id) comment.user = req.user.id;

    blog.comments.push(comment);
    await blog.save();

    const added = blog.comments[blog.comments.length - 1];
    res.status(201).json(added);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    res.status(500).json({ message: err.message });
  }
};

// Add or toggle reaction (protected)
exports.addReaction = async (req, res) => {
  try {
    // must be authenticated
    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    const { type } = req.body;
    const allowed = ["like", "love", "thumbs"];
    const reactionType = allowed.includes(type) ? type : "like";

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // find existing reaction by this user
    const existingIndex = blog.reactions.findIndex(
      (r) => r.user.toString() === req.user.id
    );
    if (existingIndex > -1) {
      // if same type -> remove (toggle off)
      if (blog.reactions[existingIndex].type === reactionType) {
        blog.reactions.splice(existingIndex, 1);
      } else {
        // change type
        blog.reactions[existingIndex].type = reactionType;
        blog.reactions[existingIndex].createdAt = Date.now();
      }
    } else {
      blog.reactions.push({ user: req.user.id, type: reactionType });
    }

    await blog.save();

    // compute counts
    const counts = blog.reactions.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {});

    const me = blog.reactions.find((r) => r.user.toString() === req.user.id);

    res.status(200).json({ counts, me: me ? me.type : null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
