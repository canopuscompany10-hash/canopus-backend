import mongoose from "mongoose";

const weddingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, 
  },
  { timestamps: true }
);

const Wedding = mongoose.model("Wedding", weddingSchema);
export default Wedding;
