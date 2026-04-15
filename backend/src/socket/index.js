import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketMiddleware } from "../middleware/socketMiddleware.js";
import Order from "../models/Order.js";
import { formatOrder } from "../lib/formatOrder.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
io.use(socketMiddleware);
const currentOrders = new Map();

export const clearTableCart = (tableId) => {
  if (!tableId) return;
  const tableKey = tableId.toString();
  currentOrders.set(tableKey, []);
  io.to(tableKey).emit("current-cart", []);
};

io.on("connection", (socket) => {
  console.log("Socket connected: " + socket.id);

  socket.on("joinBranchRoom", (branchId) => {
    socket.join(branchId);
    console.log(`Socket ${socket.id} joined branch room ${branchId}`);
  });

  socket.on("join-TableRoom", async (tableId) => {
    socket.join(tableId);
    console.log(`Socket ${socket.id} joined table room ${tableId}`);

    if (!currentOrders.has(tableId)) {
      currentOrders.set(tableId, []);
    }
    socket.emit("current-cart", currentOrders.get(tableId));

    // Check if there's an incomplete order for this table
    try {
      const incompleteOrder = await Order.findOne({
        table: tableId,
        status: { $ne: "completed" },
      })
        .populate("table", "number")
        .populate("servedBy", "displayName")
        .populate("items.dishId", "name price imageUrl")
        .lean();

      if (incompleteOrder) {
        console.log(`Found incomplete order for table ${tableId}: ${incompleteOrder._id}`);
        const formattedOrder = formatOrder(incompleteOrder);
        socket.emit("current-order", formattedOrder);
      }
    } catch (error) {
      console.error("Error fetching incomplete order:", error);
    }
  });

  socket.on("cart-updated", ({ dish, quantity, note, tableId }) => {
    const currentCart = currentOrders.get(tableId) || [];
    const index = currentCart.findIndex(
      (item) => item.dish._id === dish._id
    );

    if (index !== -1) {
      currentCart[index].quantity += quantity;
      currentCart[index].note = note;
    } else {
      currentCart.push({ dish, quantity, note });
    }

    currentOrders.set(tableId, currentCart);
    io.to(tableId).emit("current-cart", currentCart);
  });

  socket.on("remove-from-cart", ({ dishId, tableId }) => {
    const currentCart = currentOrders.get(tableId) || [];

    const updatedCart = currentCart.filter(
      (item) => item.dish._id !== dishId
    );

    currentOrders.set(tableId, updatedCart);

    io.to(tableId).emit("remove-from-cart", { dishId });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected: " + socket.id);
  });
});

export { io, app, server };
