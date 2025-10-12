import mongoose from "mongoose";
import dotenv from "dotenv";
import Wedding from "./models/Wedding.model.js"; // Make sure your Wedding model exists

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Sample wedding data
const sampleTitles = [
  "Elegant Beach Wedding",
  "Romantic Garden Wedding",
  "Luxury Hall Wedding",
  "Vintage Theme Wedding",
  "Classic Church Wedding",
  "Modern Rooftop Wedding",
  "Fairytale Castle Wedding",
];

const sampleDescriptions = [
  "A beautiful and elegant wedding by the beach.",
  "Romantic garden wedding with flowers and lights.",
  "Luxurious wedding hall with premium decor.",
  "Vintage themed wedding with classic vibes.",
  "Classic church wedding with family and friends.",
  "Modern rooftop wedding with city view.",
  "Fairytale castle wedding with royal charm.",
];

const sampleImages = [
  "https://picsum.photos/seed/w1/400/300",
  "https://picsum.photos/seed/w2/400/300",
  "https://picsum.photos/seed/w3/400/300",
  "https://picsum.photos/seed/w4/400/300",
  "https://picsum.photos/seed/w5/400/300",
  "https://picsum.photos/seed/w6/400/300",
  "https://picsum.photos/seed/w7/400/300",
];

// Generate random wedding items
const generateWeddings = (count = 20) => {
  const weddings = [];
  for (let i = 0; i < count; i++) {
    const title = sampleTitles[Math.floor(Math.random() * sampleTitles.length)] + ` ${i + 1}`;
    const description = sampleDescriptions[Math.floor(Math.random() * sampleDescriptions.length)];
    const image = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    weddings.push({ title, description, image });
  }
  return weddings;
};

const seedWeddings = async () => {
  try {
    await Wedding.deleteMany({}); // Optional: clear existing weddings
    const weddings = generateWeddings(20); // Generate 20 wedding entries
    await Wedding.insertMany(weddings);
    console.log("Successfully added 20 wedding entries!");
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
};

seedWeddings();
