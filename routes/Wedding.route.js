import express from "express";
import { createWedding, deleteWedding, getWeddingById, getWeddings } from "../controller/Wedding.controller.js";

const WeddingRouter = express.Router();

WeddingRouter.post("/", createWedding);
WeddingRouter.get("/", getWeddings);
WeddingRouter.get("/:id", getWeddingById);
WeddingRouter.delete("/:id", deleteWedding);

export default WeddingRouter;
