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
  updateWorkerProfile,
  switchRoleToPoster,
  getAllReviews,
  getCompletedTaskWorkerSide,
  getEarningHeroData,
  getTransactionHistory,
  getWorkerEarningsChart,
  withdrawWorkerEarnings,
  getWorkerNotifications,
  markAllWorkerNotificationsRead,
  markWorkerNotificationRead,
  getWorkerUnreadCount,
  getWorkerHeaderStatus,
  toggleWorkerLiveStatus
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
router.get('/profile', verifyToken, getWorkerProfile);
router.get('/reviews', verifyToken, getAllReviews);
router.get('/task/:taskId/completed', verifyToken, getCompletedTaskWorkerSide);
router.get('/earnings/hero', verifyToken, getEarningHeroData);
router.get('/earnings/transactions', verifyToken, getTransactionHistory);
router.get('/earnings/chart', verifyToken, getWorkerEarningsChart);
router.get('/notifications', verifyToken, getWorkerNotifications);
router.get('/notifications/unread-count', verifyToken, getWorkerUnreadCount);
router.get('/status/header', verifyToken, getWorkerHeaderStatus);
router.patch('/status/live', verifyToken, toggleWorkerLiveStatus);
router.patch('/notifications/mark-all-read', verifyToken, markAllWorkerNotificationsRead);
router.patch('/notifications/:id/read', verifyToken, markWorkerNotificationRead);

router.post("/tasks/add_bid", verifyToken, addNewBid);
router.post('/earnings/withdraw', verifyToken, withdrawWorkerEarnings);

router.delete("/bid/withdraw/:bidId", verifyToken, withdrawBid);

router.patch("/task/:taskId/progress", verifyToken, updateJobProgress);
router.patch("/profile/update", verifyToken, upload.fields([{ name: 'avatar', maxCount: 1 }]), updateWorkerProfile);
router.patch('/switch/role', verifyToken, switchRoleToPoster)

export default router;
