import express from 'express';
const router = express.Router();
import { captureOrder, createOrder, orderPayout } from '../controller/paymentController.js';
import verifyToken from '../middlewares/verifyToken.js';

router.post('/orders', verifyToken, createOrder);

router.post('/orders/:orderId/capture', verifyToken, captureOrder);

router.post('/orders/:bidId/payout',verifyToken, orderPayout)

export default router;
