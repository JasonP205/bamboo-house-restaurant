import express from "express";
import {
  fetchBranchs,
  fetchBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../controller/branchController.js";
import { managerMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", fetchBranchs);
router.get("/:branchId", fetchBranchById);
router.post("/", managerMiddleware, createBranch);
router.put("/", managerMiddleware, updateBranch);
router.delete("/", managerMiddleware, deleteBranch);

export default router;
