const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadImage } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });
if (upload) {
  // POST /api/uploads  (protected)
  router.post("/", protect, upload.single("image"), uploadImage);
} else {
  // If multer isn't installed, expose a friendly error instead of crashing the server
  router.post("/", protect, (req, res) => {
    res.status(501).json({
      message:
        "Image upload feature not available. Install 'multer' on the server.",
    });
  });
}

module.exports = router;
