import express from "express";
import { fetchCopyrights } from "../controller/copyrightController.js";

const router = express.Router();

router.get("/", fetchCopyrights);

export default router;
