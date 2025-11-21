const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  getProfile,
  getProfileByUsername,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const User = require("../models/userModel");

/* =============================
      AUTH ROUTES
============================= */

router.post("/register", registerUser);
router.post("/login", loginUser);

/* =============================
      GET LOGGED-IN USER
============================= */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching user" });
  }
});

/* =============================
      GET OWN PROFILE
============================= */
router.get("/profile", protect, getProfile);

/* =============================
      GET PROFILE BY USERNAME
============================= */
router.get("/:username", getProfileByUsername);

/* =============================
      UPDATE PROFILE (ONE ROUTE ONLY)
============================= */
router.put("/profile/update", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Basic profile fields
    user.username = req.body.username || user.username;
    user.bio = req.body.bio || user.bio;
    user.location = req.body.location || user.location;
    user.profession = req.body.profession || user.profession;
    user.profilePic = req.body.profilePic || user.profilePic;

    // Socials object
    if (!user.social) user.social = {};

    user.social.instagram = req.body.instagram || user.social.instagram;
    user.social.twitter = req.body.twitter || user.social.twitter;
    user.social.github = req.body.github || user.social.github;
    user.social.facebook = req.body.facebook || user.social.facebook;
    user.social.linkedin = req.body.linkedin || user.social.linkedin;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error updating profile" });
  }
});

/* =============================
      ADMIN ROUTES
============================= */

// Get all users
router.get("/", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching users" });
  }
});

// Delete user
router.delete("/:id", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting user" });
  }
});

module.exports = router;
