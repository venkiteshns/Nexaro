import express from "express";
import upload from "../middlewares/upload.js";
import verifyToken from "../middlewares/verifyToken.js";
import { createTask, getMyTasks, cancelTaskByPoster } from "../controller/PosterControllers/taskController.js";
import { getPosterBids, acceptBid } from "../controller/PosterControllers/posterController.js";

const router = express.Router();

router.post(
    "/tasks/create",
    verifyToken,
    upload.array("photos", 5),
    createTask
);
router.get(
    "/tasks",
    verifyToken,
    getMyTasks
);
router.get('/task/bids/:taskId', verifyToken, getPosterBids);

router.patch('/bid/accept/:bidId', verifyToken, acceptBid);
router.patch('/task/cancel/:taskId', verifyToken, cancelTaskByPoster)

export default router;
