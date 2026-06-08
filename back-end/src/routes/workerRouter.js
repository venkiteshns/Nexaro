import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { getNearbyTasks } from "../controller/WorkerControllers/workerController.js";

const router = express.Router();

router.get(
    "/tasks/nearby",
    verifyToken,
    getNearbyTasks
);

export default router;
