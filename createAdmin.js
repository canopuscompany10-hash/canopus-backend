import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.model.js"; // Make sure this path is correct

dotenv.config();

// Replace with your MongoDB URI in .env file
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/catering_canopus";

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: "fayizpachu217@gmail.com" });
    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("pachuadaaa", 10); // <-- Change password here

    const admin = new User({
      name: "Fayiz",
      email: "fayizpachu217@gmail.com", // <-- Change email if you want
      password: hashedPassword,
      role: "admin",
      notifications: {
        email: true,
        whatsapp: true,
      },
    });

    await admin.save();
    console.log("✅ Admin created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
