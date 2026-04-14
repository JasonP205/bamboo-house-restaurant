import Order from "../models/Order.js";
import Branch from "../models/Branch.js";
import Staff from "../models/Staff.js";
import Customer from "../models/Customer.js";
import Table from "../models/Table.js";
import Dish from "../models/Dish.js";
import helper from "../lib/helper.js";
import { io } from "../socket/index.js";
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
      .populate("customer", "displayName")
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

    // 1. Validate
    if (!branchId || !tableId || !dishes?.length) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 2. Check table
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    // 3. Check branch
    if (table.branch.toString() !== branchId) {
      return res.status(400).json({
        success: false,
        message: "Invalid branch for this table",
      });
    }

    // 4. Check bàn đang dùng
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

    // 5. Lấy dish từ DB
    const dishIds = dishes.map((d) => d.dish);

    const dbDishes = await Dish.find({
      _id: { $in: dishIds },
    });

    // 6. Map items + tính tiền
    let totalPrice = 0;

    const items = dishes.map((item) => {
      const dish = dbDishes.find((d) => d._id.toString() === item.dish);

      if (!dish) {
        throw new Error(`Dish not found: ${item.dish}`);
      }

      const price = dish.price;

      totalPrice += price * item.quantity;

      return {
        dishId: dish._id,
        price,
        quantity: item.quantity,
        notes: item.note || "",
      };
    });

    // 7. Generate orderCode
    const orderCode = "ORD" + Date.now().toString().slice(-6);

    // 8. Create order
    const newOrder = await Order.create({
      orderCode,
      table: tableId,
      branch: branchId,
      items,
      totalPrice,
      status: "pending",
      timeIn: new Date(),
    });

    // 9. Update table
    await Table.updateOne({ _id: tableId }, { $set: { isInUse: true } });

    // 🔥 10. Populate để trả đúng format
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("items.dishId", "name imageUrl")
      .populate("table", "number")
      .lean();

    const formattedOrder = formatOrder(populatedOrder);

    // 🔥 11. SOCKET REALTIME
    io.to(branchId.toString()).emit("tableUpdated", {
      tableId,
      orderId: newOrder._id,
      status: "pending",
    });

    // 12. Response
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
    res.status(200).json({ success: true, message: "Order revoked successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const addOrderItem = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderData } = req.body;

    const order = await Order.findById(orderId);

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

    const addedPrice = newItems.reduce((t, i) => t + i.price * i.quantity, 0);

    order.totalPrice += addedPrice;

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { staffId } = req?.staff._id;
  const { orderId } = req?.params;
  if (!orderId ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing orderId or status" });
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
        return res.status(400).json({ success: false, message: "Invalid order status transition" });
    }

    if (status === "completed") {
      order.isInUse = false;
      order.timeOut = new Date();
      const customerId = order?.customer;
      if (customerId) {
        const customer = await Customer.findById(customerId);
        if (customer) {
          const pointsPerCurrency = helper.getPointPerCurrency(customer.tiers);
          const earnedPoints = Math.floor(order.totalPrice * pointsPerCurrency);
          const newPoints = customer.points + earnedPoints;
          const newTier = helper.calculateTier(newPoints);
          customer.points = newPoints;
          customer.tiers = newTier;
          await customer.save();
        }
      }
    }
    order.status = status;
    order.servedBy = staffId;
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("table", "number")
      .populate("customer", "displayName")
      .populate("servedBy", "displayName")
      .populate("items.dishId", "name price imageUrl")
      .lean();

    const formattedOrder = formatOrder(populatedOrder);
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
      .populate("customer", "name email")
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
