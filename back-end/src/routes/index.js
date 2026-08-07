import express from "express";
import authRouter from "./authRouter.js";
import adminRouter from "./adminRouter.js";
import posterRouter from "./posterRouter.js";
import workerRouter from "./workerRouter.js";
import paymentRouter from "./paymentRoute.js"; // Import the payment route

const router = express.Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/poster', posterRouter);
router.use('/worker', workerRouter);
router.use('/payment', paymentRouter); 

export default router;