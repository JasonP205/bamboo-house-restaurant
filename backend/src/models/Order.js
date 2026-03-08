import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Dine-In", "Takeaway", "Delivery"],
      required: true,
    },

    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    servedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },

    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },

    items: [
      {
        dishId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Dish",
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        status: {
          type: String,
          enum: ["Pending", "In Progress", "Served", "Cancelled"],
          default: "Pending",
        },

        notes: {
          type: String,
          maxLength: 200,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Served", "Completed", "Cancelled"],
      default: "Pending",
    },

    timeIn: { type: Date, default: Date.now },
    timeOut: { type: Date },
  },
  { timestamps: true },
);
