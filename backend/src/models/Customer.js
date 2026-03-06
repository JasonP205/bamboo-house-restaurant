import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, maxLength: 100, unique: true },
    passwordHash: { type: String },
    role: {
      type: String,
      default: "Customer",
      required: true,
    },
    points: { type: Number, default: 0 },
    avatarUrl: { type: String },
    avatarId: { type: String },
    provider: {
        type: String,
        enum: ["local", "google", "facebook"],
        default: "local",
    },
    providerId: {
        type: String,
    },
  },
  { timestamps: true },
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
