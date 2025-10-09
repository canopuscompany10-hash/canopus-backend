import mongoose from "mongoose";

// Sub-schema for users assigned/attended to a work
const assignedUserSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    startTime: { type: Date }, // Actual start time
    endTime: { type: Date }, // Actual end time

    violations: [
      {
        reason: { type: String, required: true }, // Violation reason
        penalty: { type: Number, default: 0 }, // Salary deduction
        date: { type: Date, default: Date.now },
      },
    ],

    review: { type: String, default: "" },

    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { _id: false }
);

const workSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    assignedTo: [assignedUserSchema], // People already doing the work
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    status: {
      type: String,
   enum: ["pending", "in progress", "done", "completed"], 
      default: "pending",
    },

    dueDate: { type: Date },
    startTime: { type: Date },
    endTime: { type: Date },
    budget: { type: Number, default: 0 },
    totalMembers: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Work = mongoose.models.Work || mongoose.model("Work", workSchema);
export default Work;
