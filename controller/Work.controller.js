import Work from "../models/Work.model.js";

// CREATE WORK
export const createWork = async (req, res) => {
  try {
    let {
      title,
      description,
      assignedTo,
      dueDate,
      startTime,
      endTime,
      budget,
      totalMembers,
      status,
    } = req.body;

    if (!Array.isArray(assignedTo)) assignedTo = [];

    // Assign staff with default amountPaid = 0 if not present
    const formattedAssignedTo = assignedTo.map((userId) => ({
      user: userId,
      amountPaid: 0,
      paymentStatus: "pending",
      violations: [],
      review: "",
    }));

    const work = await Work.create({
      title,
      description,
      dueDate,
      startTime,
      endTime,
      budget: budget || 0,
      totalMembers: totalMembers || formattedAssignedTo.length,
      assignedTo: formattedAssignedTo,
      createdBy: req.user?._id || null,
      status: status || "pending", // default to "pending"
    });

    const populatedWork = await Work.findById(work._id)
      .populate("createdBy", "name role")
      .populate("assignedTo.user", "name role");

    res.status(201).json({ message: "Work created successfully", work: populatedWork });
  } catch (error) {
    res.status(500).json({ message: "Error creating work", error: error.message });
  }
};

// GET ALL WORKS
export const getAllWorks = async (req, res) => {
  try {
    const works = await Work.find()
      .populate("createdBy", "name role")
      .populate("assignedTo.user", "name role");
    res.json(works);
  } catch (error) {
    res.status(500).json({ message: "Error fetching works", error: error.message });
  }
};

// GET SINGLE WORK
export const getWorkById = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id)
      .populate("createdBy", "name role")
      .populate("assignedTo.user", "name role");

    if (!work) return res.status(404).json({ message: "Work not found" });

    res.json(work);
  } catch (error) {
    res.status(500).json({ message: "Error fetching work", error: error.message });
  }
};

// UPDATE WORK
export const updateWork = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      dueDate,
      startTime,
      endTime,
      budget,
      assignedTo,
      totalMembers,
    } = req.body;

    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ message: "Work not found" });

    // Update fields
    if (title !== undefined) work.title = title;
    if (description !== undefined) work.description = description;
    if (status !== undefined) {
      const validStatuses = ["pending", "in progress", "done", "completed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      work.status = status;
    }
    if (dueDate !== undefined) work.dueDate = dueDate;
    if (startTime !== undefined) work.startTime = startTime;
    if (endTime !== undefined) work.endTime = endTime;
    if (budget !== undefined) work.budget = budget;
    if (totalMembers !== undefined) work.totalMembers = totalMembers;

    // Update assignedTo if provided
    if (Array.isArray(assignedTo)) {
      const updatedAssigned = assignedTo.map((userId) => {
        const existing = work.assignedTo.find((a) => a.user.toString() === userId);
        return (
          existing || {
            user: userId,
            amountPaid: 0,
            paymentStatus: "pending",
            violations: [],
            review: "",
          }
        );
      });
      work.assignedTo = updatedAssigned;
    }

    await work.save();

    const populatedWork = await Work.findById(work._id)
      .populate("createdBy", "name role")
      .populate("assignedTo.user", "name role");

    res.json({ message: "Work updated successfully", work: populatedWork });
  } catch (error) {
    res.status(500).json({ message: "Error updating work", error: error.message });
  }
};

// UPDATE STAFF PAYMENT / PERFORMANCE
export const updateStaffPayment = async (req, res) => {
  try {
    const { workId, staffId } = req.params;
    const { amountPaid, paymentStatus } = req.body;

    const work = await Work.findById(workId);
    if (!work) return res.status(404).json({ message: "Work not found" });

    const assigned = work.assignedTo.find((a) => a.user.toString() === staffId);
    if (!assigned)
      return res.status(404).json({ message: "Staff not assigned to this work" });

    if (amountPaid !== undefined) assigned.amountPaid = amountPaid;
    if (paymentStatus) assigned.paymentStatus = paymentStatus;

    await work.save();

    const populatedWork = await Work.findById(workId)
      .populate("createdBy", "name role")
      .populate("assignedTo.user", "name role");

    res.json({ message: "Staff payment updated successfully", work: populatedWork });
  } catch (error) {
    res.status(500).json({ message: "Error updating staff payment", error: error.message });
  }
};

// DELETE WORK
export const deleteWork = async (req, res) => {
  try {
    const work = await Work.findByIdAndDelete(req.params.id);
    if (!work) return res.status(404).json({ message: "Work not found" });

    res.json({ message: "Work deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting work", error: error.message });
  }
};

// UPDATE STAFF PERFORMANCE
export const updateStaffPerformance = async (req, res) => {
  try {
    const { workId, staffId } = req.params;
    const { amountPaid, paymentStatus, violations, review } = req.body;

    const work = await Work.findById(workId);
    if (!work) return res.status(404).json({ message: "Work not found" });

    const staffIndex = work.assignedTo.findIndex((s) => s.user.toString() === staffId);
    if (staffIndex === -1)
      return res.status(404).json({ message: "Staff not assigned to this work" });

    if (amountPaid !== undefined) work.assignedTo[staffIndex].amountPaid = amountPaid;
    if (paymentStatus) work.assignedTo[staffIndex].paymentStatus = paymentStatus;
    if (violations) work.assignedTo[staffIndex].violations = violations;
    if (review !== undefined) work.assignedTo[staffIndex].review = review;

    await work.save();

    const populatedWork = await Work.findById(workId).populate(
      "assignedTo.user",
      "name email role"
    );
    res.json({ message: "Staff updated", work: populatedWork });
  } catch (err) {
    res.status(500).json({ message: "Error updating staff", error: err.message });
  }
};
