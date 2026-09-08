import mongoose from "mongoose";
import AdminNotification from "../models/adminNotificationSchema.js";
import Task from "../models/taskSchema.js";
import Transaction from "../models/transactionSchema.js";
import Review from "../models/reviewSchema.js";
import User from "../models/userSchema.js";
import Bid from "../models/bidsSchema.js";
import { getIo } from "../socket.js";

/**
 * Record a real admin notification and emit in real-time via Socket.IO
 */
export const recordAdminAlert = async ({
    type,
    title,
    description,
    priority = "normal",
    dotColor = "emerald",
    uniqueKey = null,
    metadata = {},
    createdAt = new Date(),
  }) => {
    try {
      let alert;
      if (uniqueKey) {
        alert = await AdminNotification.findOneAndUpdate(
          { uniqueKey },
          {
            $setOnInsert: {
              type,
              title,
              description,
              priority,
              dotColor,
              isRead: false,
              metadata,
              createdAt,
            },
          },
          { upsert: true, new: true }
        );
      } else {
        alert = await AdminNotification.create({
          type,
          title,
          description,
          priority,
          dotColor,
          isRead: false,
          metadata,
          createdAt,
        });
      }

      // Emit live socket event to all connected admin clients
      try {
        const io = getIo();
        if (io) {
          io.emit("admin-notification", {
            notification: alert,
            message: `${title}: ${description}`,
          });
        }
      } catch (socketErr) {
        // Socket not ready or outside web context
      }

      return alert;
    } catch (error) {
      console.error("Error recording admin alert:", error.message);
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
 * Sync and compile all real notifications directly from existing MongoDB records:
 * - Real tasks posted by users with location and amount
 * - Real bids accepted
 * - Real tasks completed
 * - Real tasks cancelled
 * - Real worker payouts initiated & completed
 * - Real platform fee commissions credited
 * - Real reviews added with rating and comments
 * - Real user sign ups & KYC verifications
 */
export const syncRealPlatformNotifications = async () => {
  try {
    // 1. Remove mock dummy alerts from previous placeholder seed (marked by dummy names or no uniqueKey)
    await AdminNotification.deleteMany({
      $or: [
        { description: { $regex: /Ravi Kumar|Julianne Smith|Suresh Babu|Arjun Sharma|Manoj K|Anita Verma/i } },
        { uniqueKey: { $exists: false } },
        { uniqueKey: null },
      ],
    });

    const alertsToUpsert = [];

    // 2. Process real Tasks
    const tasks = await Task.find()
      .populate("posterId", "name email")
      .populate("workerId", "name email")
      .populate("acceptedBid", "amount")
      .lean();

    for (const t of tasks) {
      const location = formatTaskLocation(t.address);
      const posterName = t.posterId?.name || "Poster";
      const workerName = t.workerId?.name || "Worker";
      const amountStr = `₹${Number(t.amount || 0).toLocaleString("en-IN")}`;

      // A. Real Task Posted
      alertsToUpsert.push({
        uniqueKey: `task_posted_${t._id}`,
        type: "new_task",
        title: "New Task Posted",
        description: `${posterName} posted "${t.title}" at ${location} for ${amountStr}.`,
        priority: t.urgencyLevel === "urgent" ? "high" : "normal",
        dotColor: "emerald",
        createdAt: t.createdAt || new Date(),
        metadata: { taskId: t._id, amount: t.amount, category: t.category },
      });

      // B. Real Bid Accepted (if task assigned or has acceptedBid)
      if (t.acceptedBid || t.status === "assigned" || t.status === "completed") {
        const bidAmount = t.acceptedBid?.amount || t.amount;
        const bidAmountStr = `₹${Number(bidAmount).toLocaleString("en-IN")}`;
        alertsToUpsert.push({
          uniqueKey: `bid_accepted_${t._id}`,
          type: "bid_accepted",
          title: "Bid Accepted",
          description: `Bid of ${bidAmountStr} accepted for "${t.title}" by ${posterName}.`,
          priority: "normal",
          dotColor: "emerald",
          createdAt: new Date(new Date(t.createdAt).getTime() + 1000 * 60 * 2), // slightly after task creation
          metadata: { taskId: t._id, bidAmount },
        });
      }

      // C. Real Task Completed
      if (t.status === "completed") {
        alertsToUpsert.push({
          uniqueKey: `task_completed_${t._id}`,
          type: "task_completed",
          title: "Task Completed",
          description: `Task "${t.title}" completed by ${workerName} for ${posterName}.`,
          priority: "normal",
          dotColor: "emerald",
          createdAt: t.completedOn || t.updatedAt || t.createdAt,
          metadata: { taskId: t._id, workerId: t.workerId?._id },
        });
      }

      // D. Real Task Cancelled
      if (t.status === "cancelled") {
        alertsToUpsert.push({
          uniqueKey: `task_cancelled_${t._id}`,
          type: "task_cancelled",
          title: "Task Cancelled",
          description: `Task "${t.title}" at ${location} was cancelled.`,
          priority: "normal",
          dotColor: "rose",
          createdAt: t.updatedAt || t.createdAt,
          metadata: { taskId: t._id },
        });
      }
    }

    // 3. Process real Transactions
    const transactions = await Transaction.find()
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .lean();

    for (const tx of transactions) {
      const txAmount = `₹${Number(tx.amount || 0).toLocaleString("en-IN")}`;
      const receiverName = tx.receiverId?.name || "Worker";

      if (tx.transactionType === "platform_fee") {
        alertsToUpsert.push({
          uniqueKey: `tx_fee_${tx._id}`,
          type: "platform_fee",
          title: "Platform Fee Credited",
          description: `Platform commission fee of ${txAmount} credited to platform revenue.`,
          priority: "normal",
          dotColor: "emerald",
          createdAt: tx.processedAt || tx.createdAt,
          metadata: { transactionId: tx._id, amount: tx.amount },
        });
      } else if (tx.transactionType === "to_worker") {
        if (tx.status === "failed") {
          alertsToUpsert.push({
            uniqueKey: `tx_payout_failed_${tx._id}`,
            type: "payout_failed",
            title: "Payout Failed",
            description: `Payout transaction of ${txAmount} for ${receiverName} failed due to payment gateway error.`,
            priority: "urgent",
            dotColor: "rose",
            createdAt: tx.processedAt || tx.createdAt,
            metadata: { transactionId: tx._id, amount: tx.amount },
          });
        } else {
          alertsToUpsert.push({
            uniqueKey: `tx_payout_${tx._id}`,
            type: "payout_initiated",
            title: "Worker Payout Initiated",
            description: `${receiverName} initiated a payout of ${txAmount} via PayPal.`,
            priority: "normal",
            dotColor: "emerald",
            createdAt: tx.processedAt || tx.createdAt,
            metadata: { transactionId: tx._id, amount: tx.amount },
          });
        }
      } else if (tx.transactionType === "to_worker_wallet") {
        alertsToUpsert.push({
          uniqueKey: `tx_wallet_${tx._id}`,
          type: "payout_requested",
          title: "Payment Released to Worker",
          description: `Payment of ${txAmount} released to ${receiverName}'s wallet for completed work.`,
          priority: "normal",
          dotColor: "emerald",
          createdAt: tx.processedAt || tx.createdAt,
          metadata: { transactionId: tx._id, amount: tx.amount },
        });
      }
    }

    // 4. Process real Reviews
    const reviews = await Review.find()
      .populate("reviewer", "name")
      .populate("reviewee", "name")
      .populate("taskId", "title")
      .lean();

    for (const r of reviews) {
      const taskTitle = r.taskId?.title ? ` for "${r.taskId.title}"` : "";
      alertsToUpsert.push({
        uniqueKey: `review_${r._id}`,
        type: "review",
        title: "New Review Added",
        description: `New Review: ${r.rating} stars for ${r.reviewee?.name || "Worker"} from ${r.reviewer?.name || "Poster"}${taskTitle}: "${r.review}".`,
        priority: "normal",
        dotColor: "yellow",
        createdAt: r.createdAt,
        metadata: { reviewId: r._id, rating: r.rating },
      });
    }

    // 5. Process real Users
    const users = await User.find({ activeRole: { $ne: "admin" } }).lean();
    for (const u of users) {
      alertsToUpsert.push({
        uniqueKey: `user_signup_${u._id}`,
        type: "signup",
        title: "New User Sign Up",
        description: `${u.name} joined as a ${u.activeRole === "worker" ? "Worker" : "Poster"}.`,
        priority: "normal",
        dotColor: "blue",
        createdAt: u.createdAt,
        metadata: { userId: u._id, role: u.activeRole },
      });

      if (u.activeRole === "worker" && u.verificationDocuments?.selfie) {
        alertsToUpsert.push({
          uniqueKey: `user_verify_${u._id}`,
          type: "verification",
          title: u.isVerified ? "Worker KYC Approved" : "Verification Pending",
          description: u.isVerified
            ? `Identity documents approved for ${u.name}.`
            : `Identity documents submitted by ${u.name} for verification review.`,
          priority: u.isVerified ? "normal" : "high",
          dotColor: u.isVerified ? "emerald" : "amber",
          createdAt: u.updatedAt || u.createdAt,
          metadata: { userId: u._id, isVerified: u.isVerified },
        });
      }
    }

    // 6. Execute bulk upserts preserving existing isRead state if already read
    const operations = alertsToUpsert.map((item) => ({
      updateOne: {
        filter: { uniqueKey: item.uniqueKey },
        update: {
          $setOnInsert: {
            type: item.type,
            title: item.title,
            description: item.description,
            priority: item.priority,
            dotColor: item.dotColor,
            isRead: false,
            metadata: item.metadata,
            createdAt: item.createdAt,
          },
        },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      await AdminNotification.bulkWrite(operations, { ordered: false });
    }

    console.log(`Synced ${operations.length} real platform notifications to AdminNotification collection.`);
  } catch (err) {
    console.error("Error syncing real platform notifications:", err.message);
  }
};
