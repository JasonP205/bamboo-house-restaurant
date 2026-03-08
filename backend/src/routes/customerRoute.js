import express from "express";

const router = express.Router();

// Example route for customers
router.get("/:test/:branchId", (req, res) => {
  const rt = req;
  return res.json({
    message: "Customer route is working!",
    params: req.params,
  });
});

export default router;
