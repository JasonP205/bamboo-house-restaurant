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
    collection: {
      type: String,
      enum: ["Appetizers", "Main Courses", "Desserts", "Beverages"],
      required: true,
    },
    price: { 
        type: Number, 
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
