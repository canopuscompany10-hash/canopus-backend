import mongoose from "mongoose";
import dotenv from "dotenv";
import MenuItem from "./models/Menu.model.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Categories and sample items
const categories = ["Weddings", "Corporate Events", "Birthday Parties", "Specials"];
const sampleNames = [
  "Grilled Chicken",
  "Beef Steak",
  "Veggie Salad",
  "Seafood Platter",
  "Chocolate Cake",
  "Fruit Tart",
  "Pasta Primavera",
  "Garlic Bread",
  "Cheese Platter",
  "Mini Sandwiches",
];

const sampleDescriptions = [
  "Delicious and freshly prepared",
  "A customer favorite",
  "Premium quality ingredients",
  "Perfect for any occasion",
  "Rich in flavor and presentation",
];

const sampleImages = [
  "https://picsum.photos/seed/1/200",
  "https://picsum.photos/seed/2/200",
  "https://picsum.photos/seed/3/200",
  "https://picsum.photos/seed/4/200",
  "https://picsum.photos/seed/5/200",
];

// Function to generate random items
const generateMenuItems = (count = 60) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    const name = sampleNames[Math.floor(Math.random() * sampleNames.length)] + ` ${i + 1}`;
    const description = sampleDescriptions[Math.floor(Math.random() * sampleDescriptions.length)];
    const price = Math.floor(Math.random() * 50) + 10; // $10 - $60
    const category = categories[Math.floor(Math.random() * categories.length)];
    const image = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    items.push({ name, description, price, category, image });
  }
  return items;
};

const seedMenu = async () => {
  try {
    await MenuItem.deleteMany({}); // Optional: clear existing items
    const items = generateMenuItems(60);
    await MenuItem.insertMany(items);
    console.log("Successfully added 60 menu items!");
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
};

seedMenu();
