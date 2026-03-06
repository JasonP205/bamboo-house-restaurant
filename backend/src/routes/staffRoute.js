import express from 'express'; 

const router = express.Router();

// Example route for staff
router.get('/', (req, res) => {
  res.json({ message: 'List of staff' });
});

export default router;