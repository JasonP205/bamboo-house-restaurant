import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true, lowercase: true, maxLength: 100 },
    email: { type: String, required: true, lowercase: true, maxLength: 100, unique: true },
    passwordHash: { type: String },
    role: {
      type: String,
      default: "Customer",
      required: true,
    },
    tiers:{
      type: String,
      enum: ["Sprout", "Shoot", "Stem", "Grove", "Legend"],
      default: "Sprout",
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
