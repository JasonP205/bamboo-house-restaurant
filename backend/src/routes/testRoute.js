import express from "express";
import helper from "../lib/helper.js";
const router = express.Router();

router.post("/", (req, res) => {
    const { text } = req.body;
    const result = helper.langDetector(text);
    res.status(200).json({ language: result });
});

export default router;