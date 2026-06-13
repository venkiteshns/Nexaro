import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { getNearbyTasks, getTaskForBid } from "../controller/WorkerControllers/workerController.js";
import { addNewBid } from "../controller/PosterControllers/taskController.js";

const router = express.Router();

router.get(
    "/tasks/nearby",
    verifyToken,
    getNearbyTasks
);

router.get("/task/:taskId", verifyToken, getTaskForBid)

router.post('/tasks/add_bid', verifyToken, addNewBid)

export default router;
