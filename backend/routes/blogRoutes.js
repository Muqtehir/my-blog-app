const express = require("express");
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getBlogs).post(protect, createBlog);

router
  .route("/:id")
  .get(getBlog)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

module.exports = router;
