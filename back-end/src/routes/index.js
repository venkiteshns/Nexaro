import express from "express";
import authRouter from "./authRouter.js";
import adminRouter from "./adminRouter.js";

const router = express.Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
// router.use('/poster', posterRouter);
// router.use('/worker', workerRouter);

export default router;