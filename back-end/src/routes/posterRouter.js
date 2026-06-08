import express from "express";
import upload from "../middlewares/upload.js";
import verifyToken from "../middlewares/verifyToken.js";
import { createTask, getMyTasks } from "../controller/PosterControllers/taskController.js";

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

export default router;
