import express from "express";
import {
  registerCustomer,
  registerStaff,
  staffLogin,
  customerLogin,
  logout,
} from "../controller/authController.js";
import { managerMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register/customer", registerCustomer);
router.post("/register/staff", managerMiddleware, registerStaff);
router.post("/login/staff", staffLogin);
router.post("/login/customer", customerLogin);
router.post("/logout", logout);

export default router;
