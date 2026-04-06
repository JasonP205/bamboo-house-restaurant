import express from "express";
import {
  registerCustomer,
  registerStaff,
  staffLogin,
  customerLogin,
  logout,
  fetchMe,
  refresh,
  googleAuth,
  googleAuthCallback,
} from "../controller/authController.js";
import { managerMiddleware, protectedRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register/customer", registerCustomer);
router.post("/register/staff", managerMiddleware, registerStaff);
router.post("/login/staff", staffLogin);
router.post("/login/customer", customerLogin);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", protectedRoute, fetchMe);


router.get("/oauth2/google", googleAuth);
router.get("/login/google/callback", googleAuthCallback);

export default router;
