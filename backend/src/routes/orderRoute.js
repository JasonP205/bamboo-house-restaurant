import express from 'express'; 
import * as controller from '../controller/orderController.js';
const router = express.Router();

// Example route for orders
router.get('/:orderId', controller.getOrderDetails);
router.get('/branch/:branchId', controller.getAllOrdersOfBranch);
router.post('/', controller.createOrder);

export default router;