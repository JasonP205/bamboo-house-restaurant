import express from 'express'; 

const router = express.Router();

// Example route for customers
router.get('/', (req, res) => {
  res.json({ message: 'List of customers' });
});

export default router;