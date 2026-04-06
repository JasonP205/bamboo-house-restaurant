import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
    customerName: { type: String, required: true, maxLength: 100 },
    customerContact: { type: String, required: true, maxLength: 20 },
    bookingDate: { type: Date, required: true },
    bookingTime: { type: String, required: true },
    numberOfGuests: { type: Number, required: true, min: 1 },
    bookingExpiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

bookingSchema.index({ bookingExpiresAt: 1 }, { expireAfterSeconds: 0 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
    