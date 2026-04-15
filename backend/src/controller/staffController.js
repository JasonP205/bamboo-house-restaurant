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

export const getStaffById = async (req, res) => {
  try {
    const { staffId } = req.params;
    if (!staffId) {
      return res
        .status(400)
        .json({ success: false, message: "Staff ID is required" });
    }

    const targetStaff = await Staff.findById(staffId)
      .select("-passwordHash -avatarId")
      .lean();

    if (!targetStaff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }
    const requester = req.staff;
    const isManager = requester?.role === "manager";
    
    if (!isManager) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this staff profile",
      });
    }

    return res.status(200).json({ success: true, staff: targetStaff });
  } catch (error) {
    console.error("Error fetching staff detail:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch staff detail" });
  }
};

export const updateStaffById = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { displayName, email, gender, dateOfJoining } = req.body;

    if (!staffId) {
      return res
        .status(400)
        .json({ success: false, message: "Staff ID is required" });
    }

    const targetStaff = await Staff.findById(staffId);
    if (!targetStaff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }

    const requester = req.staff;
    const isManager = requester?.role === "manager";
    
    if (!isManager && sameBranch) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this staff profile",
      });
    }

    let hasChanges = false;

    if (displayName !== undefined) {
      const nextDisplayName = String(displayName).trim();
      if (!nextDisplayName) {
        return res.status(400).json({
          success: false,
          message: "Display name cannot be empty",
        });
      }
      targetStaff.displayName = nextDisplayName;
      hasChanges = true;
    }

    if (email !== undefined) {
      const nextEmail = String(email).trim().toLowerCase();
      if (!nextEmail) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty",
        });
      }

      const duplicatedStaff = await Staff.findOne({
        email: nextEmail,
        _id: { $ne: staffId },
      }).lean();

      if (duplicatedStaff) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      targetStaff.email = nextEmail;
      hasChanges = true;
    }

    if (gender !== undefined) {
      const allowedGender = ["male", "female", "other"];
      if (!allowedGender.includes(gender)) {
        return res.status(400).json({
          success: false,
          message: "Gender is invalid",
        });
      }
      targetStaff.gender = gender;
      hasChanges = true;
    }

    if (dateOfJoining !== undefined) {
      const nextDate = new Date(dateOfJoining);
      if (Number.isNaN(nextDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Date of joining is invalid",
        });
      }
      targetStaff.dateOfJoining = nextDate;
      hasChanges = true;
    }

    if (!hasChanges) {
      return res
        .status(400)
        .json({ success: false, message: "No changes provided" });
    }

    await targetStaff.save();

    const updatedStaff = await Staff.findById(staffId)
      .select("-passwordHash -avatarId")
      .lean();

    return res.status(200).json({ success: true, staff: updatedStaff });
  } catch (error) {
    console.error("Error updating staff profile:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update staff profile" });
  }
};
