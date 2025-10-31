const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  getProfileByUsername,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/:username", getProfileByUsername);

// Admin routes
router.get("/", protect, async (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin)
      return res.status(403).json({ message: "Unauthorized" });
    const User = require("../models/userModel");
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", protect, async (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin)
      return res.status(403).json({ message: "Unauthorized" });
    const User = require("../models/userModel");
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.deleteOne();
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
