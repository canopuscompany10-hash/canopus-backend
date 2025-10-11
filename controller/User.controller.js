import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        salary: user.salary,
        notifications: user.notifications,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE USER
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.password)
      updates.password = await bcrypt.hash(updates.password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE NOTIFICATION SETTINGS
export const updateNotifications = async (req, res) => {
  try {
    const { email, whatsapp } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { notifications: { email, whatsapp } } },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Notifications updated successfully",
      notifications: user.notifications,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET USERS BY ROLE
export const getSomeUser = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["staff", "manager", "admin"] },
    }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE USER (Admin only)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, salary } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role.toLowerCase(),
      salary: salary || 0,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        salary: newUser.salary,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "No user found with this email." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    // ✅ Setup email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Canopus Company" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your Canopus account password",
      html: `
        <p>Hello ${user.name || "User"},</p>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}" style="color:#fff;background:#e11d48;padding:10px 20px;text-decoration:none;border-radius:6px;">Reset Password</a>
        <p>This link expires in 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Reset link sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending reset link." });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token." });
  }
};