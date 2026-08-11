import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  getNearbyTasks,
  getTaskForBid,
  getWorkerBids,
  getWorkerBidDetails,
  withdrawBid,
  getWorkerActiveJob,
  getWorkerCurrentActiveJob,
  updateJobProgress,
  getWorkerProfile,
  updateWorkerProfile
} from "../controller/WorkerControllers/workerController.js";

import { addNewBid } from "../controller/PosterControllers/taskController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/tasks/nearby", verifyToken, getNearbyTasks);
router.get("/task/:taskId", verifyToken, getTaskForBid);
router.get("/my-bids", verifyToken, getWorkerBids);
router.get("/bid-details/:bidId", verifyToken, getWorkerBidDetails);
router.get("/active-job", verifyToken, getWorkerCurrentActiveJob); // param collision
router.get("/task/:taskId/active-job", verifyToken, getWorkerActiveJob);
router.get('/profile', verifyToken, getWorkerProfile)

router.post("/tasks/add_bid", verifyToken, addNewBid);

router.delete("/bid/withdraw/:bidId", verifyToken, withdrawBid);

router.patch("/task/:taskId/progress", verifyToken, updateJobProgress);
router.patch("/profile/update", verifyToken, upload.fields([{ name: 'avatar',  maxCount: 1}]), updateWorkerProfile)

export default router;
