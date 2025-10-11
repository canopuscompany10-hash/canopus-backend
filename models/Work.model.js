import mongoose from "mongoose";

// Sub-schema for assigned staff
const assignedUserSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    violations: [
      {
        reason: { type: String, required: true },
        penalty: { type: Number, default: 0 },
        date: { type: Date, default: Date.now },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    amountPaid: { type: Number, default: 0 }, // Amount paid per staff
  },
  { _id: false }
);

const workSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    assignedTo: [assignedUserSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "in progress", "done", "completed"],
      default: "pending",
    },
    overallPaymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending", // ✅ Overall work payment status
    },
    dueDate: { type: Date },
    startTime: { type: Date },
    endTime: { type: Date },
    budget: { type: Number, default: 0 },
    totalMembers: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Optional: Add a method to recalc overallPaymentStatus
workSchema.methods.recalculatePaymentStatus = function () {
  if (this.assignedTo.every((staff) => staff.paymentStatus === "completed")) {
    this.overallPaymentStatus = "completed";
  } else {
    this.overallPaymentStatus = "pending";
  }
  return this.overallPaymentStatus;
};

const Work = mongoose.models.Work || mongoose.model("Work", workSchema);
export default Work;
