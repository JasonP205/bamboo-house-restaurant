import Branch from "../models/Branch.js";
import Table from "../models/Table.js";
import bcrypt from "bcrypt";
import Order from "../models/Order.js";
import { uploadBranchImageFromBuffer } from "../middleware/fileMiddleware.js";
import mongoose, { get } from "mongoose";

export const fetchBranchs = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ createdAt: -1 }).lean();
    if (!branches || branches.length === 0) {
      return res
        .status(404)
        .json({ success: true, message: "No branches found", branches });
    }
    res.status(200).json({ success: true, branches });
  } catch (error) {
    console.error("Error fetching branches:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const fetchBranchById = async (req, res) => {
  const { branchId } = req?.params;
  if (!branchId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing branchId" });
  }
  const _id = new mongoose.Types.ObjectId(branchId);
  try {
    const branch = await Branch.aggregate([
      {
        $match: { _id },
      },
      {
        $lookup: {
          from: "staffs",
          let: { branchId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$branchId", "$$branchId"] },
              },
            },
            {
              $count: "total",
            },
          ],
          as: "staffStats",
        },
      },

      // 🧠 format lại data
      {
        $addFields: {
          totalStaffs: {
            $ifNull: [{ $arrayElemAt: ["$staffStats.total", 0] }, 0],
          },
        },
      },

      {
        $project: {
          imageId: 0,
          staffStats: 0,
        },
      },
    ]);
    if (!branch.length) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }

    res.status(200).json({
      success: true,
      branch: branch[0],
    });
  } catch (error) {
    console.error("Error fetching branch by ID:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const createBranch = async (req, res) => {
  try {
    let {
      name,
      location,
      contactNumber,
      openingHours,
      floorSpace,
      mapCoordinates,
    } = req.body;

    // 🔥 parse từ string → object
    if (typeof openingHours === "string") {
      openingHours = JSON.parse(openingHours);
    }

    // ✅ validate
    if (
      !name ||
      !location ||
      !contactNumber ||
      !openingHours?.open ||
      !openingHours?.close ||
      !floorSpace ||
      !mapCoordinates
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing important information",
      });
    }

    const newBranch = new Branch({
      name,
      location,
      contactNumber,
      openingHours,
      floorSpace,
      mapCoordinates,
    });

    if (req.file) {
      const result = await uploadBranchImageFromBuffer(req.file.buffer, {
        public_id: `branch_${newBranch._id}`,
      });
      newBranch.imageUrl = result.secure_url;
      newBranch.imageId = result.public_id;
    }
    await newBranch.save();

    res.status(201).json({
      success: true,
      branch: newBranch,
    });
  } catch (error) {
    console.error("Error creating branch:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateBranch = async (req, res) => {
  const { branchId } = req?.params;
  let {
    name,
    location,
    contactNumber,
    openingHours,
    floorSpace,
    mapCoordinates,
  } = req?.body;
  if (!branchId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing branchId" });
  }
  try {
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }
    if (typeof openingHours === "string") {
      openingHours = JSON.parse(openingHours);
    }
    if (name !== undefined && name.trim() !== "") branch.name = name;
    if (location !== undefined && location.trim() !== "")
      branch.location = location;
    if (contactNumber !== undefined && contactNumber.trim() !== "")
      branch.contactNumber = contactNumber;
    if (openingHours !== undefined && openingHours !== null)
      branch.openingHours = openingHours;
    if (floorSpace !== undefined && floorSpace.trim() !== "")
      branch.floorSpace = floorSpace;
    if (mapCoordinates !== undefined && mapCoordinates.trim() !== "")
      branch.mapCoordinates = mapCoordinates;
    if (req.file) {
      const result = await uploadBranchImageFromBuffer(req.file.buffer, {
        public_id: `branch_${branch._id}`,
        overwrite: true,
        invalidate: true,
      });
      branch.imageUrl = result.secure_url;
    }
    await branch.save();
    res.status(200).json({ success: true, branch });
  } catch (error) {
    console.error("Error updating branch:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const updateStatus = async (req, res) => {
  const { branchId } = req?.params;
  if (!branchId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing branchId" });
  }
  try {
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }
    branch.isOpen = !branch.isOpen;
    await branch.save();
    res.status(200).json({ success: true, result: branch.isOpen });
  } catch (error) {
    console.error("Error updating branch status:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteBranch = async (req, res) => {
  const { branchId } = req?.params;
  if (!branchId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing branchId" });
  }
  try {
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }
    await Branch.findByIdAndDelete(branchId);
    res
      .status(200)
      .json({ success: true, message: "Branch deleted successfully" });
  } catch (error) {
    console.error("Error deleting branch:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const fetchTableOfBranch = async (req, res) => {
  const { branchId } = req?.params;

  if (!branchId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing branchId" });
  }

  try {
    const tables = await Table.find({ branch: branchId })
      .select("-branch")
      .lean();

    const tableIds = tables.map((t) => t._id);

    const activeOrders = await Order.find({
      table: { $in: tableIds },
      status: { $in: ["pending", "in-progress", "served"] }, // 👈 bàn còn đang dùng
    }).select("table status");

    const orderMap = {};
    activeOrders.forEach((order) => {
      orderMap[order.table.toString()] = order;
    });

    const result = tables.map((table) => ({
      ...table,
      isInUse: !!orderMap[table._id.toString()],
      currentOrder: orderMap[table._id.toString()] || null,
    }));

    res.status(200).json({ success: true, tables: result });
  } catch (error) {
    console.error("Error fetching tables of branch:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const createTableForBranch = async (req, res) => {
  const { branchId } = req?.params;
  const { tables } = req?.body;
  if (!branchId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing branchId" });
  }
  if (!Array.isArray(tables) || tables.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid table value" });
  }

  try {
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }
    const lastTableNumber = branch.lastTableNumber || 0;
    const formattedTableData = tables.map((t, index) => ({
      ...t,
      number: index + 1 + lastTableNumber,
      branch: branchId,
    }));
    const newTables = await Table.insertMany(formattedTableData);
    branch.lastTableNumber = lastTableNumber + newTables.length;
    branch.totalTables = lastTableNumber + newTables.length;
    await branch.save();
    res.status(201).json({ success: true, tables: newTables });
  } catch (error) {
    console.error("Error creating table for branch:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteTable = async (req, res) => {
  const { branchId } = req.params;
  const { tables: tableIds } = req.body;

  if (!branchId) {
    return res.status(400).json({
      success: false,
      message: "Missing branchId",
    });
  }

  if (!Array.isArray(tableIds) || tableIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid tableIds",
    });
  }

  try {
    // lấy đúng table tồn tại trong branch
    const tables = await Table.find({
      _id: { $in: tableIds },
      branch: branchId,
    }).select("_id");

    const idsToDelete = tables.map((t) => t._id);

    const result = await Table.deleteMany({
      _id: { $in: idsToDelete },
      branch: branchId,
    });

    await Branch.findByIdAndUpdate(branchId, {
      $inc: { totalTables: -result.deletedCount },
    });

    return res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
      deletedIds: idsToDelete,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
