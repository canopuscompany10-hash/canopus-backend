import Gallery from "../models/Gallery.model.js";

//  Add gallery image
export const addGalleryImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: "Image URL is required" });

    const newImage = await Gallery.create({ image });
    res.status(201).json(newImage);
  } catch (error) {
    console.error("Add gallery image error:", error);
    res.status(500).json({ message: "Server error while adding image" });
  }
};

//  Get all gallery images with pagination
export const getGalleryImages = async (req, res) => {
  try {
    let { page = 1, limit = 8 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const total = await Gallery.countDocuments();
    const images = await Gallery.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      images,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Get gallery images error:", error);
    res.status(500).json({ message: "Server error while fetching images" });
  }
};

//  Delete gallery image
export const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Gallery.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete gallery image error:", error);
    res.status(500).json({ message: "Server error while deleting image" });
  }
};
