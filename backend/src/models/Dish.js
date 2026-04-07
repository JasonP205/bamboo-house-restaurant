import mongoose from "mongoose";

const dishSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true, lowercase: true, maxLength: 100 },
      vi: { type: String, required: true, lowercase: true, maxLength: 100 },
    },
    description: {
      en: {
        type: String,
        required: true,
        maxLength: 500,
      },
      vi: {
        type: String,
        required: true,
        maxLength: 500,
      },
    },
    category: {
      type: String,
      enum: ["appetizers", "main", "desserts", "beverages"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    dietary: {
      type: [String],
      default: [],
      set: (arr) => arr.slice(0, 3),
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    imageUrl: { type: String },
    imageId: { type: String },
  },
  { timestamps: true },
);

const Dish = mongoose.model("Dish", dishSchema);

export default Dish;
