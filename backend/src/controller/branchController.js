import Branch from "../models/Branch.js";
import bcrypt from "bcrypt";

const fetchBranchs = async (req, res) => {
  try {
    const branches = await Branch.find();
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
  const { branchId } = req?.body;
  try {
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }
    res.status(200).json({ success: true, branch });
  } catch (error) {
    console.error("Error fetching branch by ID:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
const createBranch = async (req, res) => {
  const { name, location, contactNumber, openingHours, privateCode } =
    req?.body;
  if (!name || !location || !contactNumber || !openingHours) {
    return res
      .status(400)
      .json({ success: false, message: "Missing important information" });
  }
  let isValid = await bcrypt.compare(privateCode, process.env.PRIVATE_KEY);
  if (!isValid) {
    return res.status(403).json({ success: false, message: "Invalid action" });
  }

  try {
    const newBranch = new Branch({
      name,
      location,
      contactNumber,
      openingHours,
    });
    await newBranch.save();
    res.status(201).json({ success: true, branch: newBranch });
  } catch (error) {
    console.error("Error creating branch:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
const updateBranch = async (req, res) => {
  const { branchId, name, location, contactNumber, openingHours } = req?.body;
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
  const { branchId } = req?.body;
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
