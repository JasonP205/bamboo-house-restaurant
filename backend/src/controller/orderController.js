import Order from "../models/Order.js";
import Branch from "../models/Branch.js";
import Staff from "../models/Staff.js";
import Table from "../models/Table.js";
import Dish from "../models/Dish.js";
import helper from "../lib/helper.js";
import { clearTableCart, io } from "../socket/index.js";
import { formatOrder } from "../lib/formatOrder.js";

export const getAllOrdersOfBranch = async (req, res) => {
  const { branchId } = req?.params;
  if (!branchId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing branchId" });
  }
  try {
    const orders = await Order.find({ branch: branchId })
      .populate("table", "number")
      .populate("servedBy", "displayName")
      .populate("items.dishId", "name price imageUrl")
      .lean();

    const formattedOrders = orders.map(formatOrder);

    res.status(200).json({ success: true, orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching orders of branch:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const createOrder = async (req, res) => {
  try {
    const { branchId, tableId, dishes } = req.body;

    if (!branchId || !tableId || !dishes?.length) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    if (table.branch.toString() !== branchId) {
      return res.status(400).json({
        success: false,
        message: "Invalid branch for this table",
      });
    }

    const existingOrder = await Order.findOne({
      table: tableId,
      status: { $in: ["pending", "in-progress", "served"] },
    });

    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: "Table is already in use",
      });
    }

    const dishIds = dishes.map((d) => d.dish);

    const dbDishes = await Dish.find({
      _id: { $in: dishIds },
    });

    let subTotal = 0;

    const items = dishes.map((item) => {
      const dish = dbDishes.find((d) => d._id.toString() === item.dish);

      if (!dish) {
        throw new Error(`Dish not found: ${item.dish}`);
      }

      const price = dish.price;

      subTotal += price * item.quantity;

      return {
        dishId: dish._id,
        price,
        quantity: item.quantity,
        notes: item.note || "",
      };
    });

    const orderCode = "ORD" + Date.now().toString().slice(-6);
    const round = (num) => Math.round(num * 100) / 100;
    subTotal = round(subTotal);
    const vat_percentage = parseFloat(process.env.VAT_PERCENTAGE || "0") / 100;
    const vatAmount = round(subTotal * vat_percentage);
    const totalPrice = round(subTotal + vatAmount);

    const newOrder = await Order.create({
      orderCode,
      table: tableId,
      branch: branchId,
      items,
      subTotal,
      vatAmount,
      totalPrice,
      status: "pending",
      timeIn: new Date(),
    });

    await Table.updateOne({ _id: tableId }, { $set: { isInUse: true } });

    const populatedOrder = await Order.findById(newOrder._id)
      .populate("items.dishId", "name imageUrl")
      .populate("table", "number")
      .lean();

    const formattedOrder = formatOrder(populatedOrder);

    io.to(branchId.toString()).emit("tableUpdated", {
      tableId,
      orderId: newOrder._id,
      status: "pending",
    });

    const orderCreatedPayload = {
      order: formattedOrder,
      tableId: tableId.toString(),
      branchId: branchId.toString(),
    };

    io.to(branchId.toString()).emit("order-created", orderCreatedPayload);
    io.to(tableId.toString()).emit("order-created", orderCreatedPayload);
    clearTableCart(tableId);

    return res.status(201).json({
      success: true,
      order: formattedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const revokeOrder = async (req, res) => {
  const { orderId } = req?.params;
  if (!orderId) {
    return res.status(400).json({ success: false, message: "Missing orderId" });
  }
  try {
    await Order.findByIdAndDelete(orderId);
    res
      .status(200)
      .json({ success: true, message: "Order revoked successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addOrderItem = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderData = req.body?.orderData || req.body;

    if (!orderData?.dishes?.length) {
      return res.status(400).json({
        success: false,
        message: "Missing dishes payload",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const dishIds = orderData.dishes.map((i) => i.dish);

    const dishes = await Dish.find({
      _id: { $in: dishIds },
    }).select("price");

    const dishMap = new Map();

    dishes.forEach((d) => {
      dishMap.set(d._id.toString(), d.price);
    });

    const newItems = orderData.dishes.map((item) => {
      const price = dishMap.get(item.dish);

      return {
        dishId: item.dish,
        price,
        quantity: item.quantity,
        notes: item.note || "",
      };
    });

    order.items.push(...newItems);

    const round = (num) => Math.round(num * 100) / 100;
    let subTotal = 0;
    order.items.forEach((item) => {
      subTotal += item.price * item.quantity;
    });
    subTotal = round(subTotal);
    const vat_percentage = parseFloat(process.env.VAT_PERCENTAGE || "0") / 100;
    const vatAmount = round(subTotal * vat_percentage);
    const totalPrice = round(subTotal + vatAmount);
    order.subTotal = subTotal;
    order.vatAmount = vatAmount;
    order.totalPrice = totalPrice;

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("table", "number")
      .populate("servedBy", "displayName")
      .populate("items.dishId", "name price imageUrl")
      .lean();

    const formattedOrder = formatOrder(populatedOrder);
    const tableId = order.table?.toString();
    const branchId = order.branch?.toString();
    const orderItemsPayload = {
      order: formattedOrder,
      tableId,
      branchId,
    };

    if (branchId) {
      io.to(branchId).emit("order-items-added", orderItemsPayload);
    }
    if (tableId) {
      io.to(tableId).emit("order-items-added", orderItemsPayload);
    }

    res.status(200).json({
      success: true,
      order: formattedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  const staffId = req?.staff?._id;
  const { orderId } = req?.params;
  if (!orderId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing orderId or status" });
  }

  if (!staffId) {
    return res
      .status(401)
      .json({ success: false, message: "Staff authentication is required" });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    let status;
    switch (order.status) {
      case "pending":
        status = "in-progress";
        break;
      case "in-progress":
        status = "served";
        break;
      case "served":
        status = "completed";
        break;
      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid order status transition" });
    }

    if (status === "completed") {
      await Table.updateOne({ _id: order.table }, { $set: { isInUse: false } });
      order.timeOut = new Date();
    }
    order.status = status;
    order.servedBy = staffId;
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("table", "number")
      .populate("servedBy", "displayName")
      .populate("items.dishId", "name price imageUrl")
      .lean();

    const formattedOrder = formatOrder(populatedOrder);

    const tableId = order.table?.toString();
    const branchId = order.branch?.toString();
    const statusPayload = {
      order: formattedOrder,
      tableId,
      branchId,
    };

    if (branchId) {
      io.to(branchId).emit("order-status-updated", statusPayload);
      io.to(branchId).emit("tableUpdated", {
        tableId,
        orderId: order._id,
        status,
      });
    }
    if (tableId) {
      io.to(tableId).emit("order-status-updated", statusPayload);
    }

    res.status(200).json({ success: true, order: formattedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderDetails = async (req, res) => {
  const { orderId } = req?.params;
  if (!orderId) {
    return res.status(400).json({ success: false, message: "Missing orderId" });
  }
  try {
    const order = await Order.findById(orderId)
      .populate("table", "number")
      .populate("servedBy", "name email")
      .populate("items.dishId", "name price");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    const formattedOrder = formatOrder(order);
    res.status(200).json({ success: true, order: formattedOrder });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
