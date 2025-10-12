import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.model.js"; // Ensure correct path

dotenv.config();

// MongoDB URI from .env
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/catering_canopus";

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const existing = await User.findOne({ email: "fayizpachu217@gmail.com" });
    if (existing) {
      console.log("ℹ️ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("pachuadaaasuperadmin", 10); 

    const admin = new User({
      name: "Fayiz",
      email: "fayizpachu217@gmail.com",
      password: hashedPassword,
      role: "superadmin",
      notifications: {
        email: true,
        whatsapp: true,
      },
      totalWorkCompleted: 0, // Provide default value if needed
    });

    await admin.save();
    console.log("✅ Superadmin created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
