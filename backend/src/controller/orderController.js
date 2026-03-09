import Order from "../models/Order.js";
import Branch from "../models/Branch.js";
import Staff from "../models/Staff.js";
import Customer from "../models/Customer.js";
import Table from "../models/Table.js";
import Dish from "../models/Dish.js";
import helper from "../utils/helper.js";

export const createOrder = async (req, res) => {
  try {
    const {customerId} = req?.body;
    const { orderList, tableId, type } = req.body;
    let branchId;

    if (!orderList || orderList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order list is empty",
      });
    }

    // lấy tất cả dishId
    const dishIds = orderList.map((item) => item.dish._id);

    // query 1 lần
    const dishes = await Dish.find({
      _id: { $in: dishIds },
    }).select("price");

    // tạo map dishId -> price
    const dishMap = new Map();

    dishes.forEach((dish) => {
      dishMap.set(dish._id.toString(), dish.price);
    });

    // tạo items với snapshot price
    const items = orderList.map((item) => {
      const price = dishMap.get(item.dish._id);

      return {
        dishId: item.dish._id,
        price: price, // snapshot
        quantity: item.quantity,
        notes: item.notes || "",
      };
    });

    // tính total
    const totalPrice = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const newOrder = new Order({
      type,
      table: tableId,
      branch: branchId,
      customer: customerId,
      items,
      totalPrice,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addOrderItem = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newOrderItemList } = req.body;

    const order = await Order.findById(orderId);

    const dishIds = newOrderItemList.map((i) => i.dish._id);

    const dishes = await Dish.find({
      _id: { $in: dishIds },
    }).select("price");

    const dishMap = new Map();

    dishes.forEach((d) => {
      dishMap.set(d._id.toString(), d.price);
    });

    const newItems = newOrderItemList.map((item) => {
      const price = dishMap.get(item.dish._id);

      return {
        dishId: item.dish._id,
        price,
        quantity: item.quantity,
        notes: item.notes || "",
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

export const updateOrderItemStatus = async (req, res) => {
  try {
    const { orderId } = req?.params;
    const { listItemStatus } = req?.body;

    // listItemStatus = [
    //     {
    //         itemId: "64a1f2e5c9e7b2a1b2c3d4e",
    //         status: "In Progress"
    //     },
    //     {
    //         itemId: "64a1f2e5c9e7b2a1b2c3d4f",
    //         status: "Served"
    //     }
    // ]

    if (!orderId || !listItemStatus || listItemStatus.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing orderId or listItemStatus" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // tạo map itemId -> status
    const statusMap = new Map();

    listItemStatus.forEach((item) => {
      statusMap.set(item.itemId, item.status);
    });

    // cập nhật status cho từng item
    order.items.forEach((item) => {
      const newStatus = statusMap.get(item._id.toString());
      if (newStatus) {
        item.status = newStatus;
      }
    });

    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { staffId } = req?.staff._id;
  const { orderId, status } = req?.params;
  if (!orderId || !status) {
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

    if (status === "Completed") {
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

    order.servedBy = staffId;
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderByBranchId = async (req, res) => {
  const { orderId, branchId } = req?.body;
  if (!orderId) {
    return res.status(400).json({ success: false, message: "Missing orderId" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (order.branch.toString() !== branchId) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied for this order" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const getOrdersByBranch = async (req, res) => {
  const { branchId } = req?.branchId;
  if (!branchId) {
    return res.status(400).json({ success: false, message: "Missing branchId" });
  }

  try {
    const orders = await Order.find({ branch: branchId });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
