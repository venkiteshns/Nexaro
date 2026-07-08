import express from "express";
import upload from "../middlewares/upload.js";
import verifyToken from "../middlewares/verifyToken.js";
import { createTask, getMyTasks, cancelTaskByPoster, updateTask } from "../controller/PosterControllers/taskController.js";
import { getPosterBids, acceptBid, getPosterTaskProgress, updateUserProfile, getCompletedTaskPosterSide, getPosterProfile } from "../controller/PosterControllers/posterController.js";

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
router.get('/task/:taskId/progress', verifyToken, getPosterTaskProgress);
router.get('/task/completed/:taskId', verifyToken, getCompletedTaskPosterSide);

router.patch('/bid/accept/:bidId', verifyToken, acceptBid);
router.patch('/task/cancel/:taskId', verifyToken, cancelTaskByPoster)
router.patch('/task/update/:taskId', verifyToken, upload.array('photos', 5), updateTask)
router.patch('/profile/update', verifyToken, updateUserProfile);

router.get('/profile', verifyToken, getPosterProfile);

export default router;
