import Wedding from "../models/Wedding.model.js";

// Create a new wedding
export const createWedding = async (req, res) => {
  try {
    const { title, description, image } = req.body;
    if (!title || !description || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newWedding = await Wedding.create({ title, description, image });
    res.status(201).json(newWedding);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all weddings
export const getWeddings = async (req, res) => {
  try {
    const weddings = await Wedding.find().sort({ createdAt: -1 });
    res.status(200).json(weddings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get single wedding
export const getWeddingById = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });
    res.status(200).json(wedding);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete wedding
export const deleteWedding = async (req, res) => {
  try {
    const wedding = await Wedding.findByIdAndDelete(req.params.id);
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });
    res.status(200).json({ message: "Wedding deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
