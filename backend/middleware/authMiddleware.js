import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    console.log("[authMiddleware] token received");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("[authMiddleware] decoded token id=", decoded?.id);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      console.warn("[authMiddleware] user not found for id=", decoded?.id);
      return res.status(401).json({ message: "Not authorized, user missing" });
    }

    console.log(
      "[authMiddleware] authenticated user=",
      req.user.username || req.user._id
    );

    next();
  } catch (err) {
    console.error("[authMiddleware] invalid token:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
