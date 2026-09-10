import mongoose from "mongoose";

const adminNotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "review",
        "signup",
        "verification",
        "payout_requested",
        "payout_initiated",
        "payout_failed",
        "new_task",
        "bid_accepted",
        "task_cancelled",
        "task_completed",
        "platform_fee",
        "announcement",
        "system",
      ],
      default: "system",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    dotColor: {
      type: String,
      enum: ["yellow", "blue", "amber", "emerald", "rose"],
      default: "yellow",
    },
    uniqueKey: {
      type: String,
      unique: true,
      sparse: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

adminNotificationSchema.index({ createdAt: -1 });
adminNotificationSchema.index({ isRead: 1 });

const AdminNotification = mongoose.model("AdminNotification", adminNotificationSchema);

export default AdminNotification;
