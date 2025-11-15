const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/userModel");

// Get logged-in user's profile
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

// Update profile
router.put("/update", protect, async (req, res) => {
  const { username, bio, phone, location } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, bio, phone, location },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});
router.put("/update", protect, async (req, res) => {
  const { username, bio, phone, location, profileImage } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, bio, phone, location, profileImage },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router;
