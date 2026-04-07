import express from "express";
import {
  fetchBranchs,
  fetchBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
  fetchTableOfBranch,
  createTableForBranch,
  deleteTable,
  updateStatus
} from "../controller/branchController.js";
import {
  managerMiddleware,
  protectedRouteStaff,
} from "../middleware/authMiddleware.js";
import { uploadImage } from "../middleware/fileMiddleware.js";
import dishRoute from "./dishRoute.js";
const router = express.Router();

router.get("/", fetchBranchs);
router.get("/:branchId", protectedRouteStaff, fetchBranchById);
router.get("/:branchId/tables", protectedRouteStaff, fetchTableOfBranch);
router.post(
  "/",
  protectedRouteStaff,
  uploadImage.single("image"),
  createBranch,
);
router.post("/:branchId/tables", protectedRouteStaff, createTableForBranch);
router.put("/:branchId", protectedRouteStaff, uploadImage.single("image"), updateBranch);

router.patch("/:branchId/open-status", protectedRouteStaff, updateStatus);

router.delete("/:branchId", protectedRouteStaff, deleteBranch);
router.delete("/:branchId/tables", protectedRouteStaff, deleteTable);


// Branch only 

// Branch Table only

// Branch Dish only
router.use("/:branchId/dishes", protectedRouteStaff, dishRoute);

// Branch Staff only

export default router;
