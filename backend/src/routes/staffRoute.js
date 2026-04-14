import express from 'express'; 
import * as controllers from '../controller/staffController.js';
import { uploadImage } from '../middleware/fileMiddleware.js';
const router = express.Router();

// Example route for staff
router.get("/", controllers.fetchStaffByBranchId);
router.delete("/", controllers.deleteStaff);
router.patch("/avatar", uploadImage.single("avatar"), controllers.updateAvatar);

export default router;