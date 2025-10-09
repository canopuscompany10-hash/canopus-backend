import express from "express";
const WorkRouter = express.Router();

import {
  createWork,
  getAllWorks,
  getWorkById,
  updateWork,
  updateStaffPerformance,
  deleteWork,
} from "../controller/Work.controller.js";
import { adminOnly, protect } from "../middleware/authMiddlewares.js";

// 🔹 Work CRUD Routes
WorkRouter.post("/", protect, adminOnly, createWork);
WorkRouter.get("/", getAllWorks);
WorkRouter.get("/:id", getWorkById);
WorkRouter.put("/:id", updateWork);
WorkRouter.delete("/:id", deleteWork);

// 🔹 Staff performance updates
WorkRouter.patch(
  "/:workId/staff/:staffId",
  protect,
  adminOnly,
  updateStaffPerformance
);

export default WorkRouter;
