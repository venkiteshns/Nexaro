import mongoose from "mongoose";
import PosterNotification from "../models/posterNotificationSchema.js";
import Task from "../models/taskSchema.js";
import Transaction from "../models/transactionSchema.js";
import Review from "../models/reviewSchema.js";
import User from "../models/userSchema.js";
import Announcement from "../models/announcementSchema.js";
import { getIo } from "../socket.js";

/**
 * Record a single poster notification and broadcast in real-time via Socket.IO
 */
export const recordPosterAlert = async ({
  posterId,
  type,
  category = "system",
  title,
  description,
  amount = null,
  taskId = null,
  taskTitle = null,
  workerId = null,
  workerName = null,
  workerAvatar = null,
  bidId = null,
  actionLink = null,
  actionLabel = null,
  secondaryActionLink = null,
  secondaryActionLabel = null,
  badgeText = null,
  dotColor = "emerald",
  uniqueKey = null,
  metadata = {},
  createdAt = new Date(),
}) => {
  try {
    let alert;
    const posterObjectId = new mongoose.Types.ObjectId(posterId);

    const doc = {
      posterId: posterObjectId,
      type,
      category,
      title,
      description,
      amount,
      taskId,
      taskTitle,
      workerId,
      workerName,
      workerAvatar,
      bidId,
      actionLink,
      actionLabel,
      secondaryActionLink,
      secondaryActionLabel,
      badgeText,
      dotColor,
      uniqueKey,
      metadata,
      createdAt,
    };

    if (uniqueKey) {
      alert = await PosterNotification.findOneAndUpdate(
        { uniqueKey },
        { $setOnInsert: { ...doc, isRead: false } },
        { upsert: true, new: true }
      );
    } else {
      alert = await PosterNotification.create(doc);
    }

    // Realtime Socket delivery to the specific poster
    try {
      const io = getIo();
      if (io) {
        io.to(`user:${posterId}`).emit("poster-notification", {
          notification: alert,
          message: `${title}: ${description}`,
        });
      }
    } catch (socketErr) {
      // Socket not ready or outside web context
    }

    return alert;
  } catch (err) {
    console.error("Error recording poster alert:", err.message);
    return null;
  }
};

/**
 * Sync and compile all real notifications for a specific poster from existing records:
 * - Real worker bids on poster's tasks
 * - Real escrow payments
 * - Real task progress/completion updates
 * - Review reminders
 * - Task posted confirmations
 * - System announcements
 */
export const syncPosterNotifications = async (posterId) => {
  try {
    const posterObjectId = new mongoose.Types.ObjectId(posterId);
    const poster = await User.findById(posterObjectId).lean();
    if (!poster) return;

    // Purge any legacy bids or tasks notifications for this poster
    await PosterNotification.deleteMany({
      posterId: posterObjectId,
      $or: [
        { category: { $in: ["bids", "tasks"] } },
        { type: { $in: ["new_bid", "multiple_bids", "task_posted", "worker_assigned", "task_completed", "review_reminder"] } },
      ],
    });

    const alertsToUpsert = [];

    // 1. Process Poster's Real Payment Transactions (Escrow Payments)
    try {
      const escrowTransactions = await Transaction.find({
        senderId: posterObjectId,
        transactionType: "to_escrow",
        status: { $in: ["completed", "success"] },
      })
        .sort({ createdAt: -1 })
        .lean();

      for (const tx of escrowTransactions) {
        alertsToUpsert.push({
          posterId: posterObjectId,
          uniqueKey: `p_${posterId}_tx_${tx._id}`,
          type: "payment_escrow",
          category: "payments",
          title: `Escrow Payment Confirmed — ₹${tx.amount}`,
          description: `Funds of ₹${tx.amount} are safely secured in escrow.`,
          amount: tx.amount,
          dotColor: "emerald",
          createdAt: tx.processedAt || tx.createdAt,
          metadata: { transactionId: tx._id, amount: tx.amount },
        });
      }
    } catch (txErr) {
      console.error("Error processing escrow transactions in syncPosterNotifications:", txErr.message);
    }

    // 2. Process Poster's Completed Tasks (Payment Released to Worker)
    try {
      const completedTasks = await Task.find({
        posterId: posterObjectId,
        status: "completed",
      })
        .populate("workerId", "name")
        .sort({ completedOn: -1, updatedAt: -1 })
        .lean();

      for (const task of completedTasks) {
        const workerName = task.workerId?.name || "the professional";
        alertsToUpsert.push({
          posterId: posterObjectId,
          uniqueKey: `p_${posterId}_rel_${task._id}`,
          type: "payment_released",
          category: "payments",
          title: `Payment Released — ₹${task.amount || 0}`,
          description: `Payment has been released to ${workerName} for task "${task.title}".`,
          amount: task.amount,
          taskId: task._id,
          taskTitle: task.title,
          dotColor: "emerald",
          createdAt: task.completedOn || task.updatedAt || task.createdAt,
          metadata: { taskId: task._id, amount: task.amount },
        });
      }
    } catch (taskErr) {
      console.error("Error processing completed tasks in syncPosterNotifications:", taskErr.message);
    }

    // 3. Process Client Reviews (System)
    try {
      const reviews = await Review.find({ reviewee: posterObjectId })
        .populate("reviewer", "name")
        .sort({ createdAt: -1 })
        .lean();

      for (const r of reviews) {
        const reviewerName = r.reviewer?.name || "Professional";
        const stars = "★".repeat(Math.min(5, Math.max(1, r.rating || 5)));
        alertsToUpsert.push({
          posterId: posterObjectId,
          uniqueKey: `p_${posterId}_rev_${r._id}`,
          type: "review",
          category: "system",
          title: `New Review Received — ${stars}`,
          description: `"${r.review}" — ${reviewerName}`,
          dotColor: "amber",
          createdAt: r.createdAt,
          metadata: { reviewId: r._id, rating: r.rating },
        });
      }
    } catch (revErr) {
      console.error("Error processing reviews in syncPosterNotifications:", revErr.message);
    }

    // 4. Process Broadcast Announcements (System)
    try {
      const announcements = await Announcement.find({
        targetAudience: { $in: ["POSTERS", "ALL USERS", "posters", "all users"] },
      })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      for (const ann of announcements) {
        alertsToUpsert.push({
          posterId: posterObjectId,
          uniqueKey: `p_${posterId}_ann_${ann._id}`,
          type: "announcement",
          category: "system",
          title: ann.title,
          description: ann.message,
          dotColor: "emerald",
          createdAt: ann.createdAt,
          metadata: { announcementId: ann._id },
        });
      }
    } catch (annErr) {
      console.error("Error processing announcements in syncPosterNotifications:", annErr.message);
    }

    // 5. Bulk upsert preserving original isRead flags
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

      await PosterNotification.bulkWrite(operations, { ordered: false, timestamps: false });
    }
  } catch (err) {
    console.error("Error in syncPosterNotifications:", err.message);
  }
};
