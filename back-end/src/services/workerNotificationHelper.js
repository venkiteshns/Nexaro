import mongoose from "mongoose";
import WorkerNotification from "../models/workerNotificationSchema.js";
import Task from "../models/taskSchema.js";
import Bid from "../models/bidsSchema.js";
import Transaction from "../models/transactionSchema.js";
import Review from "../models/reviewSchema.js";
import User from "../models/userSchema.js";
import Announcement from "../models/announcementSchema.js";
import { getIo } from "../socket.js";

/**
 * Record a single worker notification and broadcast in real-time via Socket.IO
 */
export const recordWorkerAlert = async ({
  workerId,
  type,
  category = "system",
  title,
  description,
  amount = null,
  distance = null,
  location = null,
  rating = null,
  jobId = null,
  jobTitle = null,
  tip = null,
  expiresAt = null,
  actionLink = null,
  actionLabel = null,
  secondaryActionLink = null,
  secondaryActionLabel = null,
  dotColor = "emerald",
  uniqueKey = null,
  metadata = {},
  createdAt = new Date(),
}) => {
  try {
    let alert;
    const workerObjectId = new mongoose.Types.ObjectId(workerId);

    const doc = {
      workerId: workerObjectId,
      type,
      category,
      title,
      description,
      amount,
      distance,
      location,
      rating,
      jobId,
      jobTitle,
      tip,
      expiresAt,
      actionLink,
      actionLabel,
      secondaryActionLink,
      secondaryActionLabel,
      dotColor,
      metadata,
      createdAt,
    };

    if (uniqueKey) {
      alert = await WorkerNotification.findOneAndUpdate(
        { uniqueKey },
        { $setOnInsert: { ...doc, isRead: false } },
        { upsert: true, new: true }
      );
    } else {
      alert = await WorkerNotification.create(doc);
    }

    // Realtime Socket delivery to the specific worker
    try {
      const io = getIo();
      if (io) {
        io.to(`user:${workerId}`).emit("worker-notification", {
          notification: alert,
          message: `${title}: ${description}`,
        });
      }
    } catch (socketErr) {
      // Socket not ready or outside web context
    }

    return alert;
  } catch (err) {
    console.error("Error recording worker alert:", err.message);
    return null;
  }
};

/**
 * Extract clean readable location string from task address
 */
const formatTaskLocation = (address) => {
  if (!address) return "Kerala";
  if (typeof address === "string") return address;
  if (address.landmark) {
    const parts = address.landmark.split(",");
    return parts[0]?.trim() || address.district || "Kerala";
  }
  return address.city || address.district || "Kerala";
};

/**
 * Sync and compile all real notifications for a specific worker from existing records:
 * - Real bids won/accepted
 * - Real bids not selected
 * - Real payments received
 * - Real client reviews
 * - Real nearby/urgent open tasks
 * - System announcements
 */
export const syncWorkerNotifications = async (workerId) => {
  try {
    const workerObjectId = new mongoose.Types.ObjectId(workerId);
    const worker = await User.findById(workerObjectId).lean();
    if (!worker) return;

    const alertsToUpsert = [];

    // 1. Process Worker's Real Bids
    try {
      const bids = await Bid.find({ workerId: workerObjectId }).lean();
      for (const bid of bids) {
        let task = null;
        if (bid.taskId) {
          task = await Task.findById(bid.taskId).lean();
        }
        if (!task) continue;

        const taskLocation = formatTaskLocation(task.address);
        const poster = await User.findById(task.posterId).select("name").lean();
        const posterName = poster?.name || "Client";

        if (bid.status === "accepted") {
          alertsToUpsert.push({
            workerId: workerObjectId,
            uniqueKey: `w_${workerId}_bid_acc_${bid._id}`,
            type: "bid_accepted",
            category: "bid_results",
            title: `Your Bid Was Accepted! — ₹${bid.amount}`,
            description: `${posterName} accepted your quote for '${task.title}'.`,
            amount: bid.amount,
            actionLink: `/worker/active-job/${task._id}`,
            actionLabel: "Start Job",
            dotColor: "emerald",
            createdAt: bid.updatedAt || bid.createdAt,
            metadata: { bidId: bid._id, taskId: task._id },
          });
        } else if (bid.status === "rejected") {
          alertsToUpsert.push({
            workerId: workerObjectId,
            uniqueKey: `w_${workerId}_bid_rej_${bid._id}`,
            type: "bid_rejected",
            category: "bid_results",
            title: "Bid Not Selected",
            description: `The client chose another professional for the ${taskLocation} job.`,
            tip: "💡 Tip: Workers who respond within 15 mins have a 40% higher chance of winning!",
            actionLink: "/worker/nearby-tasks",
            actionLabel: "Browse Nearby Tasks →",
            dotColor: "rose",
            createdAt: bid.updatedAt || bid.createdAt,
            metadata: { bidId: bid._id, taskId: task._id },
          });
        }
      }
    } catch (bidsErr) {
      console.error("Error processing bids in syncWorkerNotifications:", bidsErr.message);
    }

    // 2. Process Worker's Real Payment Transactions
    try {
      const transactions = await Transaction.find({
        receiverId: workerObjectId,
        transactionType: { $in: ["to_worker_wallet", "to_worker"] },
      })
        .sort({ createdAt: -1 })
        .lean();

      for (const tx of transactions) {
        const txCode = `#NX-${tx._id.toString().slice(-4).toUpperCase()}`;
        alertsToUpsert.push({
          workerId: workerObjectId,
          uniqueKey: `w_${workerId}_tx_${tx._id}`,
          type: "payment_received",
          category: "payments",
          title: `Payment Released — ₹${tx.amount} Received!`,
          description: `Your payout of ₹${tx.amount} has been credited successfully.`,
          amount: tx.amount,
          jobId: txCode,
          jobTitle: "Completed Service",
          actionLink: null,
          actionLabel: null,
          dotColor: "blue",
          createdAt: tx.processedAt || tx.createdAt,
          metadata: { transactionId: tx._id, amount: tx.amount },
        });
      }
    } catch (txErr) {
      console.error("Error processing transactions in syncWorkerNotifications:", txErr.message);
    }

    // 3. Process Worker's Real Client Reviews
    try {
      const reviews = await Review.find({ reviewee: workerObjectId })
        .populate("reviewer", "name")
        .populate("taskId", "title")
        .lean();

      for (const r of reviews) {
        const reviewerName = r.reviewer?.name || "Poster";
        const stars = "★".repeat(Math.min(5, Math.max(1, r.rating || 5)));
        alertsToUpsert.push({
          workerId: workerObjectId,
          uniqueKey: `w_${workerId}_rev_${r._id}`,
          type: "review",
          category: "system",
          title: `New Review — ${stars}`,
          description: `"${r.review}" — ${reviewerName}`,
          rating: r.rating,
          actionLink: "/worker/all-reviews",
          actionLabel: "View Review",
          dotColor: "amber",
          createdAt: r.createdAt,
          metadata: { reviewId: r._id, rating: r.rating },
        });
      }
    } catch (revErr) {
      console.error("Error processing reviews in syncWorkerNotifications:", revErr.message);
    }

    // 4. Process Real Open / Nearby Tasks
    try {
      const openTasks = await Task.find({
        status: "open",
      })
        .populate("posterId", "name")
        .limit(6)
        .lean();

      for (const task of openTasks) {
        const taskLocation = formatTaskLocation(task.address);

        if (task.urgencyLevel === "urgent" && task.status === "open") {
          alertsToUpsert.push({
            workerId: workerObjectId,
            uniqueKey: `w_${workerId}_urgent_${task._id}`,
            type: "urgent_task",
            category: "nearby_tasks",
            title: `${task.title} — ₹${task.amount}`,
            description: `${task.description || "Requires immediate attention."} Location: ${taskLocation}.`,
            amount: task.amount,
            expiresAt: new Date(Date.now() + 1000 * 60 * 30), // 30m countdown
            actionLink: `/worker/place-bid/${task._id}`,
            actionLabel: "Bid Now",
            dotColor: "amber",
            createdAt: task.createdAt,
            metadata: { taskId: task._id },
          });
        } else {
          alertsToUpsert.push({
            workerId: workerObjectId,
            uniqueKey: `w_${workerId}_task_${task._id}`,
            type: "nearby_task",
            category: "nearby_tasks",
            title: task.title,
            description: task.description || "Task open for bidding.",
            amount: task.amount,
            distance: "1.2km",
            location: taskLocation,
            actionLink: `/worker/place-bid/${task._id}`,
            actionLabel: "Place Bid",
            secondaryActionLink: `/worker/task/${task._id}`,
            secondaryActionLabel: "View Task",
            dotColor: "blue",
            createdAt: task.createdAt,
            metadata: { taskId: task._id },
          });
        }
      }
    } catch (tasksErr) {
      console.error("Error processing tasks in syncWorkerNotifications:", tasksErr.message);
    }

    // 5. Process Broadcast Announcements (sorted latest first)
    try {
      const announcements = await Announcement.find({
        targetAudience: { $in: ["WORKERS", "ALL USERS", "workers", "all users"] },
      })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      for (const ann of announcements) {
        alertsToUpsert.push({
          workerId: workerObjectId,
          uniqueKey: `w_${workerId}_ann_${ann._id}`,
          type: "announcement",
          category: "system",
          title: ann.title,
          description: ann.message,
          actionLink: null,
          actionLabel: null,
          dotColor: "emerald",
          createdAt: ann.createdAt,
          metadata: { announcementId: ann._id },
        });
      }
    } catch (annErr) {
      console.error("Error processing announcements in syncWorkerNotifications:", annErr.message);
    }

    // 6. Bulk upsert preserving original event timestamps without overwriting existing isRead flags
    if (alertsToUpsert.length > 0) {
      const operations = alertsToUpsert.map((item) => ({
        updateOne: {
          filter: { uniqueKey: item.uniqueKey },
          update: {
            $set: {
              ...item,
            },
            $setOnInsert: {
              isRead: false,
            },
          },
          upsert: true,
        },
      }));

      await WorkerNotification.bulkWrite(operations, { ordered: false, timestamps: false });
    }
  } catch (err) {
    console.error("Error in syncWorkerNotifications:", err.message);
  }
};
