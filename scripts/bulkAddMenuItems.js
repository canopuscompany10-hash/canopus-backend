// scripts/bulkAddMenuItems.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import MenuItem from "../models/Menu.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/yourdb";

const categories = ["Starter", "Main Course", "Drinks"];
const itemsPerCategory = 10;

const bulkAddMenuItems = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    for (const category of categories) {
      const items = [];
      for (let i = 1; i <= itemsPerCategory; i++) {
        items.push({
          name: `${category} Item ${i}`,
          description: `Delicious ${category} number ${i}`,
          price: Math.floor(Math.random() * 20) + 5, // price 5-25
          category,
          image: "https://via.placeholder.com/150",
        });
      }
      await MenuItem.insertMany(items);
      console.log(`Inserted ${itemsPerCategory} items for category: ${category}`);
    }

    console.log("Bulk menu insertion completed!");
    process.exit(0);
  } catch (err) {
    console.error("Error inserting menu items:", err);
    process.exit(1);
  }
};

bulkAddMenuItems();
