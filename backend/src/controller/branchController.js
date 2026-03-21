import Branch from "../models/Branch.js";
import bcrypt from "bcrypt";
import { uploadBranchImageFromBuffer } from "../middleware/fileMiddleware.js";
import mongoose from "mongoose";

const fetchBranchs = async (req, res) => {
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
const fetchBranchById = async (req, res) => {
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
      // 📊 thống kê tables
      {
        $lookup: {
          from: "tables",
          let: { branchId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$branchId", "$$branchId"] },
              },
            },
            {
              $group: {
                _id: "$location",
                count: { $sum: 1 },
              },
            },
          ],
          as: "tableStats",
        },
      },

      // 👨‍🍳 đếm staff
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
          indoorTables: {
            $ifNull: [
              {
                $first: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$tableStats",
                        as: "t",
                        cond: { $eq: ["$$t._id", "indoor"] },
                      },
                    },
                    as: "t",
                    in: "$$t.count",
                  },
                },
              },
              0,
            ],
          },
          outdoorTables: {
            $ifNull: [
              {
                $first: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$tableStats",
                        as: "t",
                        cond: { $eq: ["$$t._id", "outdoor"] },
                      },
                    },
                    as: "t",
                    in: "$$t.count",
                  },
                },
              },
              0,
            ],
          },
          totalStaffs: {
            $ifNull: [{ $arrayElemAt: ["$staffStats.total", 0] }, 0],
          },
        },
      },

      {
        $project: {
          imageId: 0,
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
      branch: branch[0]
    });
  } catch (error) {
    console.error("Error fetching branch by ID:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
const createBranch = async (req, res) => {
  try {
    let { name, location, contactNumber, openingHours } = req.body;

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
      !openingHours?.close
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
const updateBranch = async (req, res) => {
  const { branchId } = req?.params;
  const { name, location, contactNumber, openingHours } = req?.body;
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
    if (name) branch.name = name;
    if (location) branch.location = location;
    if (contactNumber) branch.contactNumber = contactNumber;
    if (openingHours) branch.openingHours = openingHours;

    await branch.save();
    res.status(200).json({ success: true, branch });
  } catch (error) {
    console.error("Error updating branch:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBranch = async (req, res) => {
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

export {
  fetchBranchs,
  fetchBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
};
