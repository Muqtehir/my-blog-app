const express = require("express");
const { uploadImage } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");
let multer;
let upload;
try {
  multer = require("multer");
  const storage = multer.memoryStorage();
  upload = multer({ storage });
} catch (err) {
  multer = null;
  upload = null;
  console.warn(
    "Optional dependency 'multer' not installed: upload route will be disabled.",
    err && err.message
  );
}

const router = express.Router();

if (upload) {
  // POST /api/uploads  (protected)
  router.post("/", protect, upload.single("image"), uploadImage);
} else {
  // If multer isn't installed, expose a friendly error instead of crashing the server
  router.post("/", protect, (req, res) => {
    res
      .status(501)
      .json({
        message:
          "Image upload feature not available. Install 'multer' on the server.",
      });
  });
}

module.exports = router;
