import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, lowercase: true, maxLength: 100 },
    location: { type: String, required: true, maxLength: 200 },
    contactNumber: { type: String, required: true, maxLength: 20 },
    openingHours: {
        open: { type: String, required: true },
        close: { type: String, required: true },
    },
    imageUrl: { type: String },
    imageId: { type: String },
  },
  { timestamps: true },
);

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;