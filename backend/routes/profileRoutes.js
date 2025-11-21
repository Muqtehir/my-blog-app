const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/userModel");

const router = express.Router();

// GET profile
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

// UPDATE profile
router.put("/update", protect, async (req, res) => {
  try {
    const updates = { ...req.body };

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile update failed" });
  }
});

module.exports = router;
