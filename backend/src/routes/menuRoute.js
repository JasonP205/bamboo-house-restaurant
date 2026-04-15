import express from "express";
import * as dishController from "../controller/menuController.js";
import { uploadImage } from "../middleware/fileMiddleware.js";
import { protectedRouteStaff } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", protectedRouteStaff, uploadImage.single("image"), dishController.createDish);
router.get("/", dishController.getMenu);
router.get("/:dishId", dishController.getDishById);
router.put("/:dishId", protectedRouteStaff, uploadImage.single("image"), dishController.updateDish);
router.delete("/:dishId", protectedRouteStaff, dishController.deleteDish);
router.patch("/:dishId/status", protectedRouteStaff, dishController.updateDishStatus);

export default router;