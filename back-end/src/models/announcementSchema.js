import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    targetAudience: {
      type: String,
      enum: ["ALL USERS", "WORKERS", "POSTERS"],
      required: true,
      default: "ALL USERS",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

announcementSchema.index({ createdAt: -1 });

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
