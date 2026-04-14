import express from 'express'; 
import * as controller from '../controller/orderController.js';
import { protectedRouteStaff } from '../middleware/authMiddleware.js';
const router = express.Router();

// Example route for orders
router.get('/branch/:branchId', controller.getAllOrdersOfBranch);
router.post('/', controller.createOrder);
router.patch('/:orderId/items', controller.addOrderItem);
router.patch('/:orderId/status', protectedRouteStaff, controller.updateOrderStatus);
router.get('/:orderId', controller.getOrderDetails);
router.delete('/:orderId', controller.revokeOrder);

export default router;