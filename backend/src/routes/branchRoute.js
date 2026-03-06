import express from 'express'; 

const router = express.Router();

// Example route for branches
router.get('/', (req, res) => {
  res.json({ message: 'List of branches' });
});

export default router;