import express from "express";
import upload from "../middlewares/upload.js";
import verifyToken from "../middlewares/verifyToken.js";
import {
  createTask,
  getMyTasks,
  cancelTaskByPoster,
  updateTask,
} from "../controller/PosterControllers/taskController.js";
import {
  getPosterBids,
  acceptBid,
  getPosterTaskProgress,
  updateUserProfile,
  getCompletedTaskPosterSide,
  getPosterProfile,
  switchRoleToWorker,
  posterRoleSwitchAlreadyDataUploaded
} from "../controller/PosterControllers/posterController.js";
import { createReview } from "../controller/PosterControllers/reviewController.js";


const router = express.Router();

router.post(
  "/tasks/create",
  verifyToken,
  upload.array("photos", 5),
  createTask,
);
router.post("/review", verifyToken, createReview);


router.get("/tasks", verifyToken, getMyTasks);
router.get("/task/bids/:taskId", verifyToken, getPosterBids);
router.get("/task/:taskId/progress", verifyToken, getPosterTaskProgress);
router.get("/task/completed/:taskId", verifyToken, getCompletedTaskPosterSide);

router.get("/profile", verifyToken, getPosterProfile);


router.patch("/bid/accept/:bidId", verifyToken, acceptBid);
router.patch("/task/cancel/:taskId", verifyToken, cancelTaskByPoster);
router.patch(
  "/task/update/:taskId",
  verifyToken,
  upload.array("photos", 5),
  updateTask,
);
router.patch(
  "/profile/update",
  verifyToken,
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  updateUserProfile,
);
router.patch('/switch/role', verifyToken, upload.fields([{ name: 'id_front' }, { name: 'id_back' }, { name: 'selfie' }]), switchRoleToWorker);
router.patch('/switch/to_worker', verifyToken, posterRoleSwitchAlreadyDataUploaded)


export default router;

