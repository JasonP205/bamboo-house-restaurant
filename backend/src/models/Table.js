import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      enum: ["Indoor", "Outdoor"],
      required: true,
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    capacity: { type: Number, required: true, min: 1 },
    isOccupied: { type: Boolean, default: false },
    isBooked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Table = mongoose.model("Table", tableSchema);

export default Table;
