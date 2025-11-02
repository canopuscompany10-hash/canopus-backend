import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./database/DBConnection.js";
import UserRouter from "./routes/User.route.js";
import GalleryRouter from "./routes/Gallery.route.js";
import MenuRouter from "./routes/Menu.route.js";
import WorkRouter from "./routes/Work.route.js";
import WeddingRouter from "./routes/Wedding.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(
  cors({
    origin: [
      "https://canopuscompany.netlify.app", // your client URL
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());

// ✅ Add this route here (important)
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// Connect to DB
connectDB();

// API routes
app.use("/api/user", UserRouter);
app.use("/api/menu", MenuRouter);
app.use("/api/gallery", GalleryRouter);
app.use("/api/work", WorkRouter);
app.use("/api/weddings", WeddingRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
