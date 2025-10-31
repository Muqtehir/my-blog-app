const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Blog = require("../models/blogModel");

// Register
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ username, email, password });
    const token = user.getSignedToken();
    res.status(201).json({ success: true, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = user.getSignedToken();
    res.status(200).json({ success: true, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current logged in user
exports.getMe = async (req, res) => {
  try {
    // auth middleware attaches req.user (without password)
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    res.status(200).json({ success: true, user: req.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get public profile by username (public)
exports.getProfileByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username }).select(
      "_id username email createdAt"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    const posts = await Blog.find({ user: user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, user, posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
