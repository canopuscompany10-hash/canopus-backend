import express from "express";
const UserRouter = express.Router();

import {
  loginUser,
  getAllUsers,
  getUser,
  updateUser,
  updateNotifications,
  getSomeUser,
  createUser,
  deleteUser,
  forgotPassword,
  resetPassword,
} from "../controller/User.controller.js";
import { adminOnly, protect } from "../middleware/authMiddlewares.js";

// 🔹 Public Routes
UserRouter.post("/login", loginUser);

// 🔹 Admin / Protected Routes
UserRouter.post("/create", protect, adminOnly, createUser);
UserRouter.get("/roles/list", getSomeUser);
UserRouter.get("/all", protect, adminOnly, getAllUsers);

// 🔹 Dynamic Routes (placed last to prevent route conflicts)
UserRouter.get("/:id", getUser);
UserRouter.put("/:id", updateUser);
UserRouter.patch("/:id/notifications", updateNotifications);
UserRouter.delete("/:id", deleteUser);



UserRouter.post("/forgot-password", forgotPassword);
UserRouter.post("/reset-password/:token", resetPassword);

export default UserRouter;