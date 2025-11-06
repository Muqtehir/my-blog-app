const express = require("express");
const {
  getPosts,
  createPost,
  addComment,
  repostPost,
  deleteComment,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Post routes
router.route("/").get(getPosts).post(protect, createPost);

// Comment routes
router.route("/:postId/comments").post(protect, addComment);

router.route("/:postId/comments/:commentId").delete(protect, deleteComment);

// Repost routes
router.route("/:postId/repost").post(protect, repostPost);

module.exports = router;
