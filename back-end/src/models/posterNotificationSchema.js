import mongoose from "mongoose";

const posterNotificationSchema = new mongoose.Schema(
  {
    posterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "new_bid",
        "multiple_bids",
        "payment_escrow",
        "task_completed",
        "worker_assigned",
        "task_posted",
        "review_reminder",
        "announcement",
        "system",
      ],
      default: "system",
    },
    category: {
      type: String,
      enum: ["bids", "payments", "tasks", "system"],
      default: "system",
      index: true,
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
    amount: {
      type: Number,
      default: null,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    taskTitle: {
      type: String,
      default: null,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    workerName: {
      type: String,
      default: null,
    },
    workerAvatar: {
      type: String,
      default: null,
    },
    bidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid",
      default: null,
    },
    actionLink: {
      type: String,
      default: null,
    },
    actionLabel: {
      type: String,
      default: null,
    },
    secondaryActionLink: {
      type: String,
      default: null,
    },
    secondaryActionLabel: {
      type: String,
      default: null,
    },
    badgeText: {
      type: String,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    dotColor: {
      type: String,
      enum: ["emerald", "blue", "amber", "rose"],
      default: "emerald",
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
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

posterNotificationSchema.index({ posterId: 1, createdAt: -1 });

const PosterNotification = mongoose.model("PosterNotification", posterNotificationSchema);

export default PosterNotification;
