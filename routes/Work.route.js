import express from "express";
const WorkRouter = express.Router();

import {
  createWork,
  getAllWorks,
  getWorkById,
  updateWork,
  updateStaffPerformance,
  deleteWork,
  updateWorkStatus,
} from "../controller/Work.controller.js";

import { adminOnly, protect } from "../middleware/authMiddlewares.js";

// Public routes
WorkRouter.get("/", getAllWorks);
WorkRouter.get("/:id", getWorkById);

// Protected routes (Admin only)
WorkRouter.post("/", protect, adminOnly, createWork);
WorkRouter.put("/:id", protect, adminOnly, updateWork);
WorkRouter.delete("/:id", protect, adminOnly, deleteWork);

WorkRouter.patch("/:workId/staff/:staffId", protect, adminOnly, updateStaffPerformance);

WorkRouter.patch("/:id/status", protect, adminOnly, updateWorkStatus);

export default WorkRouter;
