import express from 'express';
const router = express.Router();
import { captureOrder, createOrder, orderPayout } from '../controller/paymentController.js';
import verifyToken from '../middlewares/verifyToken.js';

// ROUTE 1: Create an Order
router.post('/orders', verifyToken, createOrder);

// ROUTE 2: Capture and Verify Payment
router.post('/orders/:orderId/capture', verifyToken, captureOrder);

router.post('/orders/:bidId/payout',verifyToken, orderPayout)

export default router;
