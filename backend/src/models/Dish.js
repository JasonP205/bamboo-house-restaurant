import mongoose from "mongoose";

const dishSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true, lowercase: true, maxLength: 100, trim: true },
      vi: { type: String, required: true, lowercase: true, maxLength: 100, trim: true },
    },
    description: {
      en: {
        type: String,
        required: true,
        maxLength: 600,
        trim: true,
      },
      vi: {
        type: String,
        required: true,
        maxLength: 600,
        trim: true,
      },
    },
    category: {
      type: String,
      enum: ["appetizer", "main", "beverage","merchandise"],
      required: true,
    },
    price: {
      type: Number,
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
dishSchema.index({ "name.en": 1 });
dishSchema.index({ "name.vi": 1 });

const Dish = mongoose.model("Dish", dishSchema);

export default Dish;
