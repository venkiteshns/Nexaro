import mongoose from "mongoose";

const workerNotificationSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "urgent_task",
        "nearby_task",
        "bid_accepted",
        "bid_rejected",
        "payment_received",
        "review",
        "announcement",
        "system",
      ],
      default: "system",
    },
    category: {
      type: String,
      enum: ["nearby_tasks", "bid_results", "payments", "system"],
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
    distance: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      default: null,
    },
    jobId: {
      type: String,
      default: null,
    },
    jobTitle: {
      type: String,
      default: null,
    },
    tip: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
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

workerNotificationSchema.index({ workerId: 1, createdAt: -1 });

const WorkerNotification = mongoose.model("WorkerNotification", workerNotificationSchema);

export default WorkerNotification;
