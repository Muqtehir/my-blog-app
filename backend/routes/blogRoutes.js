const express = require("express");
const {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getBlogs).post(protect, createBlog);

router.route("/:id").put(protect, updateBlog).delete(protect, deleteBlog);

module.exports = router;
