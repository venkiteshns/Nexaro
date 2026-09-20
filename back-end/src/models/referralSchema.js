import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    referrerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    refereeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    referralCode: {
      type: String,
      required: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ["registered", "completed", "expired"],
      default: "registered",
      index: true,
    },
    referrerReward: {
      type: Number,
      default: 100,
    },
    refereeReward: {
      type: Number,
      default: 50,
    },
    rewardedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Referral = mongoose.model("Referral", referralSchema);

export default Referral;
