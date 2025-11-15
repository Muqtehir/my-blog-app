const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    // Debug: log that we received a token (do not log token value in production)
    console.log("[authMiddleware] token received");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Debug: log decoded payload
    console.log("[authMiddleware] decoded token id=", decoded && decoded.id);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      console.warn(
        "[authMiddleware] user not found for id=",
        decoded && decoded.id
      );
      return res.status(401).json({ message: "Not authorized" });
    }
    console.log(
      "[authMiddleware] authenticated user=",
      req.user.username || req.user._id
    );
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
