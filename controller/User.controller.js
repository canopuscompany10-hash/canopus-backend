import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Work from "../models/Work.model.js";
import sendEmail from "../utils/sendMail.js";
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
        totalWorkCompleted: user.totalWorkCompleted, // ✅ new field
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
    const { name, email, role, salary } = req.body;

    if (!name || !email || !role)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Create user with empty password
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: "", // user will set later
      role: role.toLowerCase(),
      salary: salary || 0,
      totalWorkCompleted: 0,
    });

    await newUser.save();

    // Generate temporary token for password setup
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // valid for 1 day
    );

    const setPasswordLink = `${process.env.CLIENT_URL}/set-password/${token}`;

    // Send email
    const subject = "Set your password for Work Manager";
    const text = `
      Hi ${name},
      You have been added as a ${role} in Work Manager.
      Click the link below to set your password and login:
      ${setPasswordLink}
      This link expires in 24 hours.
    `;
     sendEmail(email, subject, text);

    res.status(201).json({
      message: "User created successfully. Email sent for password setup.",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        salary: newUser.salary,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE USER
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

// FORGOT PASSWORD
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

    // Setup email transport
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




export const setPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (!password || password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters." });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password set successfully. You can now login." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token." });
  }
};


// RESET PASSWORD
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
};export const getUsersWithWorkCompleted = async (req, res) => {
  try {
    const users = await User.find({});
    const results = await Promise.all(
      users.map(async (user) => {
        try {
          const completedWorkCount = await Work.countDocuments({
            assignedTo: { $elemMatch: { user: user._id } },
            status: "completed",
          });
          return { ...user.toObject(), totalWorkCompleted: completedWorkCount };
        } catch (err) {
          console.error("Error counting work for user:", user._id, err);
          return { ...user.toObject(), totalWorkCompleted: 0 };
        }
      })
    );
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching users with work:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserWithWorkCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const completedWorkCount = await Work.countDocuments({
      assignedTo: { $elemMatch: { user: user._id } },
      status: "completed",
    });

    res.status(200).json({
      ...user.toObject(),
      totalWorkCompleted: completedWorkCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};