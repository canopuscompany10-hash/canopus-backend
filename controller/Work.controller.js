import Work from "../models/Work.model.js";

// ✅ Create new work
export const createWork = async (req, res) => {
  try {
    const work = new Work({
      ...req.body,
      createdBy: req.user._id,
    });
    await work.save();

    const populatedWork = await Work.findById(work._id)
      .populate("assignedTo.user", "name email role");
    res.status(201).json({ work: populatedWork });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create work" });
  }
};

// ✅ Get all works
export const getAllWorks = async (req, res) => {
  try {
    const works = await Work.find()
      .populate("assignedTo.user", "name email role")
      .sort({ createdAt: -1 });
    res.status(200).json(works);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch works" });
  }
};

// ✅ Get single work by ID
export const getWorkById = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id)
      .populate("assignedTo.user", "name email role");
    if (!work) return res.status(404).json({ message: "Work not found" });
    res.status(200).json(work);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch work" });
  }
};

// ✅ Update work
export const updateWork = async (req, res) => {
  try {
    const work = await Work.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!work) return res.status(404).json({ message: "Work not found" });

    const populatedWork = await Work.findById(work._id)
      .populate("assignedTo.user", "name email role");
    res.status(200).json({ work: populatedWork });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update work" });
  }
};

// ✅ Update staff payment/performance & recalc overall payment status
export const updateStaffPerformance = async (req, res) => {
  try {
    const { workId, staffId } = req.params;
    const updateData = req.body;

    const work = await Work.findById(workId);
    if (!work) return res.status(404).json({ message: "Work not found" });

    const staffIndex = work.assignedTo.findIndex((s) => s.user.toString() === staffId);
    if (staffIndex === -1) return res.status(404).json({ message: "Staff not found in this work" });

    // Merge new data into staff
    work.assignedTo[staffIndex] = {
      ...work.assignedTo[staffIndex].toObject(),
      ...updateData,
    };

    // Automatically recalc overallPaymentStatus
    if (work.assignedTo.every((s) => s.paymentStatus === "completed")) {
      work.overallPaymentStatus = "completed";
    } else {
      work.overallPaymentStatus = "pending";
    }

    // Optional: recalc work status if budget fully paid
    const totalPaid = work.assignedTo.reduce((sum, s) => sum + (s.amountPaid || 0), 0);
    if (totalPaid >= work.budget) {
      work.status = "completed";
    } else if (totalPaid > 0) {
      work.status = "in progress";
    }

    await work.save();

    const populatedWork = await Work.findById(workId)
      .populate("assignedTo.user", "name email role");
    res.status(200).json({ work: populatedWork });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update staff performance" });
  }
};

// ✅ Delete work
export const deleteWork = async (req, res) => {
  try {
    const work = await Work.findByIdAndDelete(req.params.id);
    if (!work) return res.status(404).json({ message: "Work not found" });
    res.status(200).json({ message: "Work deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete work" });
  }
};
