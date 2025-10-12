// models/MenuItem.js
import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Menu item name is required"],
    },
    // description: {
    //   type: String,
    //   required: true,
    // },
    // price: {
    //   type: Number,
    //   required: true,
    // },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
  },
  { timestamps: true }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;
