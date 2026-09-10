import mongoose from "mongoose";
import WorkerNotification from "../models/workerNotificationSchema.js";
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
    } catch {
      // Socket not ready or outside web context
    }

    return alert;
  } catch (err) {
    console.error("Error recording worker alert:", err.message);
    return null;
  }
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

    // Purge any legacy nearby tasks, urgent tasks, or bid results notifications
    await WorkerNotification.deleteMany({
      workerId: workerObjectId,
      $or: [
        { category: { $in: ["nearby_tasks", "bid_results"] } },
        { type: { $in: ["urgent_task", "nearby_task", "bid_accepted", "bid_rejected"] } },
      ],
    });

    // 1. Process Worker's Real Payment Transactions
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

    // 2. Process Worker's Real Client Reviews (System)
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
          actionLink: null,
          actionLabel: null,
          dotColor: "amber",
          createdAt: r.createdAt,
          metadata: { reviewId: r._id, rating: r.rating },
        });
      }
    } catch (revErr) {
      console.error("Error processing reviews in syncWorkerNotifications:", revErr.message);
    }

    // 3. Process Broadcast Announcements (System)
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

    // 4. Bulk upsert preserving original event timestamps without overwriting existing isRead flags
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
