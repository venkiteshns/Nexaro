import express from "express";
import authRouter from "./authRouter.js";

const router = express.Router();

router.use('/auth', authRouter);
// router.use('/poster', posterRouter);
// router.use('/worker', workerRouter);

export default router;