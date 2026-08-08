import express from 'express';
const router = express.Router();
import { captureOrder, createOrder } from '../controller/paymentController.js';

// ROUTE 1: Create an Order
router.post('/orders',createOrder);

// ROUTE 2: Capture and Verify Payment
router.post('/orders/:orderId/capture', captureOrder);

export default router;
