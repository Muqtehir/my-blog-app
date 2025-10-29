const Post = require("../models/postModel");

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

const createPost = async (req, res) => {
  try {
    console.log("Received body:", req.body); // 👈 Add this for debugging
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const newPost = new Post({ title, content });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error.message);
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};
