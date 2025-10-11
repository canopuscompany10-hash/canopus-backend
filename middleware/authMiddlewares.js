import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// 🔹 Verify token and attach user to request
export const protect = async (req, res, next) => {
  try {
    let token;

    // Allow both "Bearer <token>" and raw token
    if (req.headers.authorization) {
      token = req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;
    }

    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Fetch user (excluding password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 🔹 Admin-only access
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin" && req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Access denied — Admins only" });
  }
  next();
};
