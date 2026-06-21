import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  getNearbyTasks,
  getTaskForBid,
  getWorkerBids,
  getWorkerBidDetails,
  withdrawBid,
  getWorkerActiveJob,
  updateJobProgress,
} from "../controller/WorkerControllers/workerController.js";
import { addNewBid } from "../controller/PosterControllers/taskController.js";

const router = express.Router();

router.get("/tasks/nearby", verifyToken, getNearbyTasks);
router.get("/task/:taskId", verifyToken, getTaskForBid);
router.get("/my-bids", verifyToken, getWorkerBids);
router.get("/bid-details/:bidId", verifyToken, getWorkerBidDetails);
router.get("/task/:taskId/active-job", verifyToken, getWorkerActiveJob);

router.post("/tasks/add_bid", verifyToken, addNewBid);

router.delete("/bid/withdraw/:bidId", verifyToken, withdrawBid);

router.patch("/task/:taskId/progress", verifyToken, updateJobProgress);

export default router;
