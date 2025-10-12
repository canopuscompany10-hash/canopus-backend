import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.model.js"; // Make sure path is correct

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/catering_canopus";

const createDemoUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const demoUsers = [];

    for (let i = 1; i <= 25; i++) {
      const email = `demouser${i}@example.com`;

      const existing = await User.findOne({ email });
      if (existing) {
        console.log(`ℹ️ User ${email} already exists, skipping`);
        continue;
      }

      const hashedPassword = await bcrypt.hash("demopassword123", 10);

      demoUsers.push({
        name: `Demo User ${i}`,
        email,
        password: hashedPassword,
        role: "staff",
        profilePic: "",
        notifications: { email: true, whatsapp: true },
        totalWorkCompleted: 0,
      });
    }

    if (demoUsers.length > 0) {
      await User.insertMany(demoUsers);
      console.log(`✅ ${demoUsers.length} demo users created successfully!`);
    } else {
      console.log("ℹ️ No new users to create");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating demo users:", err);
    process.exit(1);
  }
};

createDemoUsers();
