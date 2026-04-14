import express from 'express'; 
import * as controller from '../controller/orderController.js';
const router = express.Router();

// Example route for orders
router.get('/:orderId', controller.getOrderDetails);
router.delete('/:orderId', controller.revokeOrder);
router.get('/branch/:branchId', controller.getAllOrdersOfBranch);
router.post('/', controller.createOrder);
router.patch('/:orderId/items', controller.addOrderItem);
router.patch('/:orderId/status', controller.updateOrderStatus);

export default router;