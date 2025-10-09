import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const uri = process.env.MONGO_URI; // Read from .env

const workSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  totalMembers: Number,
  budget: Number,
  assignedTo: [{ user: String, amountPaid: Number }],
  status: { type: String, default: "pending" },
  tasks: Array,
});

const Work = mongoose.model("Work", workSchema);

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected to MongoDB");

    const works = Array.from({ length: 10 }).map((_, i) => ({
      title: `Work ${i + 1}`,
      description: `Description for Work ${i + 1}`,
      dueDate: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
      totalMembers: 3,
      budget: 1000 + i * 500,
      assignedTo: [{ user: "userId1", amountPaid: 0 }],
      status: "pending",
      tasks: [],
    }));

    await Work.insertMany(works);
    console.log("10 works added successfully!");
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
