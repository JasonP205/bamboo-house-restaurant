import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      required: true,
      maxLength: 10,
    },

    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },

    servedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },

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

        notes: {
          type: String,
          maxLength: 200,
        },

        price: {
          type: Number,
          required: true,
        },
      },
      {
        _id: false,
      },
    ],

    subTotal: {
      type: Number,
      required: true,
    },

    vatAmount: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "served", "completed"],
      default: "pending",
    },

    timeIn: { type: Date, default: Date.now },
    timeOut: { type: Date },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
