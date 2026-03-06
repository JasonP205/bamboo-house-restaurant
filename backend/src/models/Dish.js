import mongoose from "mongoose";

const dishSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true, 
        lowercase: true, 
        maxLength: 100 
    },
    description: { 
        type: String, 
        required: true, 
        maxLength: 500 
    },
    category: {
      type: String,
      enum: ["Appetizers", "Main Courses", "Desserts", "Beverages"],
      required: true,
    },
    price: { 
        type: Number, 
        required: true 
    },
    branch: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Branch", 
        required: true 
    },
    isAvailable: { 
        type: Boolean, 
        default: true 
    },
    imageUrl: { type: String },
    imageId: { type: String },
  },
  { timestamps: true },
);

const Dish = mongoose.model("Dish", dishSchema);

export default Dish;
