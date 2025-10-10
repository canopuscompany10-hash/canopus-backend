// controllers/Menu.controller.js
import mongoose from "mongoose";
import MenuItem from "../models/Menu.model.js";
import Category from "../models/Category.model.js";

// ------------------------
// Menu Item Controllers
// ------------------------

// Create new menu item with dynamic/custom category// Create new menu item with validation for image
export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, createdBy } = req.body;

    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ message: "All fields including image are required" });
    }

    // Add new category if it doesn't exist
    if (category) {
      const existingCategory = await Category.findOne({ name: category }).lean();
      if (!existingCategory) {
        await Category.create({ name: category });
      }
    }

    const newItem = await MenuItem.create({
      name,
      description,
      price,
      category,
      image,
      createdBy,
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Create menu item error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update menu item with image validation
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid menu item ID" });
    }

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(id, req.body, { new: true }).lean();

    if (!updatedItem) return res.status(404).json({ message: "Menu item not found" });

    // Add category if updated and new
    if (req.body.category) {
      const existingCategory = await Category.findOne({ name: req.body.category }).lean();
      if (!existingCategory) {
        await Category.create({ name: req.body.category });
      }
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Update menu item error:", error);
    res.status(500).json({ message: error.message });
  }
};


// Get paginated menu items
export const getMenuItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await MenuItem.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    const items = await MenuItem.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({ items, totalPages, totalCount });
  } catch (error) {
    console.error("Get menu items error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get menu item by ID with validation
export const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid menu item ID" });
    }

    const item = await MenuItem.findById(id).lean();
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    res.status(200).json(item);
  } catch (error) {
    console.error("Get menu item by ID error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update menu item


// Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid menu item ID" });
    }

    const deletedItem = await MenuItem.findByIdAndDelete(id).lean();
    if (!deletedItem) return res.status(404).json({ message: "Menu item not found" });

    res.status(200).json({ message: "Menu item deleted", deletedItem });
  } catch (error) {
    console.error("Delete menu item error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Category Controllers
// ------------------------

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new category explicitly
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

    if (["All", "Uncategorized"].includes(name)) {
      return res.status(400).json({ message: `Cannot create '${name}' category` });
    }

    const existing = await Category.findOne({ name }).lean();
    if (existing) return res.status(400).json({ message: "Category already exists" });

    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a category by name
export const deleteCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!category) return res.status(400).json({ message: "Category is required" });
    if (category === "All") return res.status(400).json({ message: "Cannot delete 'All' category" });

    // Move items to default category
    await MenuItem.updateMany({ category }, { category: "Uncategorized" });

    // Remove category from DB
    await Category.findOneAndDelete({ name: category });

    res.status(200).json({ message: `Category '${category}' deleted and items moved to 'Uncategorized'` });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Edit a category name
export const editCategory = async (req, res) => {
  try {
    const { oldCategory } = req.params;
    const { newCategory } = req.body;

    if (!oldCategory || !newCategory)
      return res.status(400).json({ message: "Both old and new category names are required" });
    if (oldCategory === "All") return res.status(400).json({ message: "Cannot edit 'All' category" });

    // Update all menu items
    await MenuItem.updateMany({ category: oldCategory }, { category: newCategory });

    // Update category in DB
    const categoryDoc = await Category.findOne({ name: oldCategory });
    if (categoryDoc) {
      categoryDoc.name = newCategory;
      await categoryDoc.save();
    }

    res.status(200).json({ message: `Category '${oldCategory}' renamed to '${newCategory}'` });
  } catch (error) {
    console.error("Edit category error:", error);
    res.status(500).json({ message: error.message });
  }
};
