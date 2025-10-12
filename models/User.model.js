import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["admin", "staff", "superadmin"], default: "staff" },
    profilePic: { type: String, default: "" },
    notifications: {
      email: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: true },
    },
    totalWorkCompleted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
