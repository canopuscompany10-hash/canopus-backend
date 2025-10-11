import express from "express";
const WorkRouter = express.Router();

import {
  createWork,
  getAllWorks,
  getWorkById,
  updateWork,
  updateStaffPerformance,
  deleteWork,
  updateWorkStatus, // new controller
} from "../controller/Work.controller.js";
import { adminOnly, protect } from "../middleware/authMiddlewares.js";

// Work CRUD routes
WorkRouter.post("/", protect, adminOnly, createWork);
WorkRouter.get("/", getAllWorks);
WorkRouter.get("/:id", getWorkById);
WorkRouter.put("/:id", protect, adminOnly, updateWork);
WorkRouter.delete("/:id", protect, adminOnly, deleteWork);

// Staff payment/performance
WorkRouter.patch("/:workId/staff/:staffId", protect, adminOnly, updateStaffPerformance);

//  Update work status
WorkRouter.patch("/:id/status", protect, adminOnly, updateWorkStatus);

export default WorkRouter;
