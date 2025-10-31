const express = require("express");
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  addComment,
  addReaction,
} = require("../controllers/blogController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getBlogs).post(protect, createBlog);

router
  .route("/:id")
  .get(getBlog)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

// Comments (public)
router.post("/:id/comments", addComment);

// Reactions (protected)
router.post("/:id/reactions", protect, addReaction);

module.exports = router;
