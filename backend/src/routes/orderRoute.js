import express from 'express'; 

const router = express.Router();

// Example route for orders
router.get('/', (req, res) => {
  res.json({ message: 'List of orders' });
});

export default router;