import express from "express";
import * as dishController from "../controller/dishController.js";
import { uploadImage } from "../middleware/fileMiddleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", uploadImage.single("image"), dishController.createDish);

export default router;