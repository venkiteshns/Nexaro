import mongoose from "mongoose";
import PosterNotification from "../models/posterNotificationSchema.js";
import Task from "../models/taskSchema.js";
import Bid from "../models/bidsSchema.js";
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

    // Purge any legacy or unwanted payment escrow notifications for this poster
    await PosterNotification.deleteMany({
      posterId: posterObjectId,
      $or: [{ type: "payment_escrow" }, { category: "payments" }],
    });

    const alertsToUpsert = [];

    // 1. Process Poster's Real Tasks
    try {
      const tasks = await Task.find({ posterId: posterObjectId })
        .populate("workerId", "name avatar picture profilePicture")
        .sort({ createdAt: -1 })
        .lean();

      for (const task of tasks) {
        const workerName = task.workerId?.name || null;
        const workerAvatar = task.workerId?.avatar || task.workerId?.picture || task.workerId?.profilePicture || null;

        // A. Task Posted Confirmation (for open tasks)
        alertsToUpsert.push({
          posterId: posterObjectId,
          uniqueKey: `p_${posterId}_task_posted_${task._id}`,
          type: "task_posted",
          category: "tasks",
          title: "Task Posted Successfully",
          description: `Your task "${task.title}" is now live and accepting bids.`,
          amount: task.amount,
          taskId: task._id,
          taskTitle: task.title,
          dotColor: "emerald",
          createdAt: task.createdAt,
          metadata: { taskId: task._id },
        });

        // B. Real Bids placed on this task
        const bids = await Bid.find({ taskId: task._id })
          .populate("workerId", "name avatar picture profilePicture")
          .sort({ createdAt: -1 })
          .lean();

        for (const bid of bids) {
          const bidderName = bid.workerId?.name || "Professional";
          const bidderAvatar = bid.workerId?.avatar || bid.workerId?.picture || bid.workerId?.profilePicture || null;

          alertsToUpsert.push({
            posterId: posterObjectId,
            uniqueKey: `p_${posterId}_bid_${bid._id}`,
            type: "new_bid",
            category: "bids",
            title: `New Bid Received — ₹${bid.amount}`,
            description: `${bidderName} has submitted a new bid on your task "${task.title}".`,
            amount: bid.amount,
            taskId: task._id,
            taskTitle: task.title,
            workerId: bid.workerId?._id || bid.workerId,
            workerName: bidderName,
            workerAvatar: bidderAvatar,
            bidId: bid._id,
            dotColor: "blue",
            createdAt: bid.createdAt,
            metadata: { taskId: task._id, bidId: bid._id },
          });
        }

        // C. Milestone if multiple bids (3 or more)
        if (bids.length >= 3) {
          alertsToUpsert.push({
            posterId: posterObjectId,
            uniqueKey: `p_${posterId}_milestone_${task._id}`,
            type: "multiple_bids",
            category: "bids",
            title: `${bids.length} More Bids on Your Task`,
            description: `Your task "${task.title}" is gaining traction! Review the new offers now.`,
            taskId: task._id,
            taskTitle: task.title,
            dotColor: "blue",
            createdAt: bids[0]?.createdAt || task.createdAt,
            metadata: { taskId: task._id, totalBids: bids.length },
          });
        }

        // D. Worker Assigned
        if (task.status === "assigned" || task.status === "in_progress" || task.status === "completed") {
          alertsToUpsert.push({
            posterId: posterObjectId,
            uniqueKey: `p_${posterId}_worker_assigned_${task._id}`,
            type: "worker_assigned",
            category: "tasks",
            title: "Worker Assigned",
            description: `You have assigned ${workerName || "a worker"} to your task. They have been notified and will contact you soon.`,
            taskId: task._id,
            taskTitle: task.title,
            workerId: task.workerId?._id || task.workerId,
            workerName,
            workerAvatar,
            dotColor: "blue",
            createdAt: task.updatedAt || task.createdAt,
            metadata: { taskId: task._id },
          });
        }

        // E. Task Marked Complete
        if (task.update === "completed" || task.status === "completed") {
          alertsToUpsert.push({
            posterId: posterObjectId,
            uniqueKey: `p_${posterId}_task_complete_${task._id}`,
            type: "task_completed",
            category: "tasks",
            title: "Task Marked Complete",
            description: `${workerName || "Your worker"} has completed the task "${task.title}". Please review and release the payment.`,
            amount: task.amount,
            taskId: task._id,
            taskTitle: task.title,
            workerId: task.workerId?._id || task.workerId,
            workerName,
            workerAvatar,
            dotColor: "emerald",
            createdAt: task.completedOn || task.updatedAt || task.createdAt,
            metadata: { taskId: task._id, amount: task.amount },
          });

          // F. Review Reminder if poster hasn't submitted a review for this task
          const existingReview = await Review.findOne({
            taskId: task._id,
            reviewer: posterObjectId,
          }).lean();

          if (!existingReview) {
            alertsToUpsert.push({
              posterId: posterObjectId,
              uniqueKey: `p_${posterId}_review_reminder_${task._id}`,
              type: "review_reminder",
              category: "tasks",
              title: "Review Reminder",
              description: `How was your experience with ${workerName || "your worker"}? Leave a review to help others.`,
              taskId: task._id,
              taskTitle: task.title,
              workerId: task.workerId?._id || task.workerId,
              workerName,
              workerAvatar,
              dotColor: "amber",
              createdAt: task.completedOn || task.updatedAt || task.createdAt,
              metadata: { taskId: task._id },
            });
          }
        }
      }
    } catch (tasksErr) {
      console.error("Error processing tasks in syncPosterNotifications:", tasksErr.message);
    }

    // 2. Process Broadcast Announcements
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

    // 4. Bulk upsert preserving original isRead flags
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
