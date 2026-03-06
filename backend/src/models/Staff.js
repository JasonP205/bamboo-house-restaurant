import mongoose from 'mongoose';    

const staffSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, lowercase: true, maxLength: 50, unique: true },
    email: { type: String, required: true, lowercase: true, maxLength: 100, unique: true },
    passwordHash: { type: String },
    role: {
      type: String,
      enum: ["Manager", "Chef", "Staff"],
      required: true,
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    avatarUrl: { type: String },
    avatarId: { type: String },
    phoneNumber: { type: String, required: true, maxLength: 12, unique: true },
    dateOfJoining: { type: Date, default: Date.now },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
  },
  { timestamps: true },
);

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;