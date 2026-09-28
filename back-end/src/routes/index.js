import express from "express";
import authRouter from "./authRouter.js";
import adminRouter from "./adminRouter.js";
import posterRouter from "./posterRouter.js";
import workerRouter from "./workerRouter.js";
import paymentRouter from "./paymentRoute.js";
import referralRouter from "./referralRouter.js";
import uploadRouter from "./uploadRouter.js";

const router = express.Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/poster', posterRouter);
router.use('/worker', workerRouter);
router.use('/payment', paymentRouter);
router.use('/referral', referralRouter);
router.use('/upload', uploadRouter);

router.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: "Server Alive" })
})

export default router;