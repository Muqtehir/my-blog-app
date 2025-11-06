const Post = require("../models/postModel");

// Helper function to check if post exists
const getPostById = async (id) => {
  const post = await Post.findById(id).populate(
    "author comments.author reposts"
  );
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
};

// Export all controller functions
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .populate("comments.author", "username")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

exports.createPost = async (req, res) => {
  try {
    console.log("Received body:", req.body);
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const newPost = new Post({
      title,
      content,
      author: req.user._id, // Add the authenticated user as author
    });
    await newPost.save();

    // Populate author details before sending response
    await newPost.populate("author", "username");
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error.message);
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user._id; // Assuming you have authentication middleware

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const post = await getPostById(postId);

    post.comments.push({
      content,
      author: userId,
    });

    await post.save();

    const updatedPost = await post.populate("comments.author");
    res.status(201).json(updatedPost);
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res
      .status(500)
      .json({ message: "Error adding comment", error: error.message });
  }
};

// Repost a post
exports.repostPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id; // Assuming you have authentication middleware

    const post = await getPostById(postId);

    // Check if user has already reposted
    if (post.reposts.includes(userId)) {
      // Remove repost
      post.reposts = post.reposts.filter((id) => !id.equals(userId));
      post.repostCount = Math.max(0, post.repostCount - 1);
    } else {
      // Add repost
      post.reposts.push(userId);
      post.repostCount += 1;
    }

    await post.save();
    const updatedPost = await post.populate("reposts");
    res.json(updatedPost);
  } catch (error) {
    console.error("Error reposting:", error.message);
    res.status(500).json({ message: "Error reposting", error: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id; // Assuming you have authentication middleware

    const post = await getPostById(postId);

    // Find comment and check if user is the author
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (!comment.author.equals(userId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    comment.remove();
    await post.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    res
      .status(500)
      .json({ message: "Error deleting comment", error: error.message });
  }
};
