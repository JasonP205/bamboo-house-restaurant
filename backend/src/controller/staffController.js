import { uploadStaffImageFromBuffer } from "../middleware/fileMiddleware.js";
import Staff from "../models/Staff.js";

export const fetchStaffByBranchId = async (req, res) => {
  const branchId = req.query.branchId;

  if (!branchId) {
    return res.status(400).json({
      success: false,
      message: "Branch ID is required",
    });
  }

  try {
    const staffMembers = await Staff.find({ branchId: branchId })
      .select("-passwordHash")
      .lean();

    return res.status(200).json({
      success: true,
      staffs: staffMembers,
    });
  } catch (error) {
    console.error("Error fetching staff members:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff members",
    });
  }
};
export const deleteStaff = async (req, res) => {
  const { staffIds } = req.body;
  if (!staffIds || !Array.isArray(staffIds) || staffIds.length === 0) {
    return res
      .status(400)
      .json({ error: "staffIds must be a non-empty array" });
  }

  try {
    const deleteResult = await Staff.deleteMany({ _id: { $in: staffIds } });
    return res
      .status(200)
      .json({ success: true, deletedCount: deleteResult.deletedCount });
  } catch (error) {
    console.error("Error deleting staff members:", error);
    return res.status(500).json({ error: "Failed to delete staff members" });
  }
};
export const updateAvatar = async (req, res) => {
  const staffId = req.staff._id;
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const staff = await Staff.findById(staffId);
  if (!staff) {
    return res.status(404).json({ error: "Staff not found" });
  }
  const imageId = staff?.avatarId;
  if (imageId) {
    const result = await uploadStaffImageFromBuffer(req.file.buffer, {
      public_id: `staff_${staff._id}`,
      overwrite: true,
      invalidate: true,
    });
    staff.avatarUrl = result.secure_url;
    staff.avatarId = result.public_id;
    await staff.save();
    return res.json({ success: true, avatarUrl: result.secure_url });
  }
  const result = await uploadStaffImageFromBuffer(req.file.buffer, {
    public_id: `staff_${staff._id}`,
  });
  staff.avatarUrl = result.secure_url;
  staff.avatarId = result.public_id;
  await staff.save();
  return res.json({ success: true, avatarUrl: result.secure_url });
};
