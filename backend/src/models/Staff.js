import mongoose from 'mongoose';    

const staffSchema = new mongoose.Schema(
  {
    staffId: { type: String, required: true, unique: true },
    displayName: { type: String, required: true, maxLength: 100 },
    email: { type: String, required: true, lowercase: true, maxLength: 100, unique: true },
    passwordHash: { type: String },
    role: {
      type: String,
      enum: ["manager", "staff"],
      default: "staff",
      required: true,
    },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch"},
    avatarUrl: { type: String },
    avatarId: { type: String },
    dateOfJoining: { type: Date, default: Date.now },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
  },
  { timestamps: true },
);

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;