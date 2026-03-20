import express from "express";
import {
  fetchBranchs,
  fetchBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../controller/branchController.js";
import { managerMiddleware, protectedRouteStaff } from "../middleware/authMiddleware.js";
import { uploadImage } from "../middleware/fileMiddleware.js";
const router = express.Router();

router.get("/", fetchBranchs);
router.get("/:branchId", fetchBranchById);
router.post(
  "/",
  protectedRouteStaff,
  uploadImage.single("image"),
  createBranch,
);
router.put("/:id", protectedRouteStaff, updateBranch);
router.delete("/:id", protectedRouteStaff, deleteBranch);

export default router;
