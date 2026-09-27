import mongoose from "mongoose";
import User from "../models/userSchema.js";
import Referral from "../models/referralSchema.js";
import Wallet from "../models/walletSchema.js";
import Transaction from "../models/transactionSchema.js";
import { recordWorkerAlert } from "./workerNotificationService.js";
import { recordPosterAlert } from "./posterNotificationService.js";
import { recordAdminAlert } from "./adminNotificationService.js";
import { getIo } from "../socket.js";
import logger from "../utils/logger.js";

const DEFAULT_REFERRER_REWARD = Number(process.env.REFERRAL_REFERRER_BONUS) || 100;
const DEFAULT_REFEREE_REWARD = Number(process.env.REFERRAL_REFEREE_BONUS) || 50;

/**
 * Validate referral code on signup or verification.
 */
export const validateReferralCodeService = async (code, currentUserId = null) => {
  try {
    if (!code || typeof code !== "string") {
      return { valid: false, message: "Referral code is required" };
    }

    const trimmedCode = code.trim().toUpperCase();
    const referrer = await User.findOne({
      referralCode: trimmedCode,
      isDeleted: false,
      isSuspended: false,
    }).select("_id name referralCode activeRole");

    if (!referrer) {
      return { valid: false, message: "Invalid or expired referral code" };
    }

    if (currentUserId && referrer._id.toString() === currentUserId.toString()) {
      return { valid: false, message: "You cannot use your own referral code" };
    }

    return {
      valid: true,
      referrerName: referrer.name,
      code: referrer.referralCode,
    };
  } catch (error) {
    logger.error("validateReferralCodeService error:", error.message);
    return { valid: false, message: "Error validating referral code" };
  }
};

/**
 * Link a new user to their referrer upon registration.
 */
export const linkReferralOnSignup = async ({ newUserId, referralCode }) => {
  try {
    if (!referralCode || !newUserId) return null;

    const trimmedCode = referralCode.trim().toUpperCase();
    const referrer = await User.findOne({
      referralCode: trimmedCode,
      isDeleted: false,
      isSuspended: false,
    });

    if (!referrer) {
      logger.warn(`Referral code ${trimmedCode} not found for user ${newUserId}`);
      return null;
    }

    if (referrer._id.toString() === newUserId.toString()) {
      logger.warn(`Self-referral attempted by user ${newUserId}`);
      return null;
    }

    // Link in User document
    await User.findByIdAndUpdate(newUserId, {
      referredBy: referrer._id,
    });

    // Create Referral document
    const referral = await Referral.create({
      referrerId: referrer._id,
      refereeId: newUserId,
      referralCode: trimmedCode,
      status: "registered",
      referrerReward: DEFAULT_REFERRER_REWARD,
      refereeReward: DEFAULT_REFEREE_REWARD,
    });

    // Increment referrer's referral count
    await User.findByIdAndUpdate(referrer._id, {
      $inc: { "referralStats.totalReferred": 1 },
    });

    return referral;
  } catch (error) {
    logger.error("linkReferralOnSignup error:", error.message);
    return null;
  }
};

const processCandidateReferral = async (candidate) => {
  const referral = await Referral.findOne({
    refereeId: new mongoose.Types.ObjectId(candidate.id),
    status: "registered",
  });

  if (!referral) return;

  const referrer = await User.findById(referral.referrerId);
  const referee = await User.findById(referral.refereeId);

  if (!referrer || !referee) return;

  const { referrerReward, refereeReward } = referral;

  // 1. Credit Referrer Wallet
  await Wallet.findOneAndUpdate(
    { userId: referrer._id },
    {
      $inc: {
        walletAmount: referrerReward,
        totalEarned: referrerReward,
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  // 2. Credit Referee Wallet
  await Wallet.findOneAndUpdate(
    { userId: referee._id },
    {
      $inc: {
        walletAmount: refereeReward,
        totalEarned: refereeReward,
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  // 3. Record Transactions
  await Transaction.create([
    {
      senderId: referrer._id,
      receiverId: referrer._id,
      amount: referrerReward,
      transactionType: "referral_reward",
      status: "completed",
      processedAt: new Date(),
    },
    {
      senderId: referee._id,
      receiverId: referee._id,
      amount: refereeReward,
      transactionType: "referral_reward",
      status: "completed",
      processedAt: new Date(),
    },
  ]);

  // 4. Mark referral as completed
  referral.status = "completed";
  referral.rewardedAt = new Date();
  await referral.save();

  // 5. Update referrer total earnings
  await User.findByIdAndUpdate(referrer._id, {
    $inc: { "referralStats.totalEarnings": referrerReward },
  });

  // 6. Notifications
  const io = getIo();

  // Alert Referrer
  const referrerPayload = {
    type: "referral_reward",
    category: "payments",
    title: "Referral Bonus Credited!",
    description: `You earned ₹${referrerReward} because ${referee.name} completed their first task on Nexaro!`,
    amount: referrerReward,
    dotColor: "emerald",
    uniqueKey: `referral_reward_referrer_${referral._id}`,
  };

  if (referrer.activeRole === "worker") {
    await recordWorkerAlert({ workerId: referrer._id, ...referrerPayload });
  } else {
    await recordPosterAlert({ posterId: referrer._id, ...referrerPayload });
  }

  // Alert Referee
  const refereePayload = {
    type: "referral_reward",
    category: "payments",
    title: "Welcome Bonus Credited!",
    description: `You earned ₹${refereeReward} welcome referral reward on your first completed task!`,
    amount: refereeReward,
    dotColor: "emerald",
    uniqueKey: `referral_reward_referee_${referral._id}`,
  };

  if (referee.activeRole === "worker") {
    await recordWorkerAlert({ workerId: referee._id, ...refereePayload });
  } else {
    await recordPosterAlert({ posterId: referee._id, ...refereePayload });
  }

  // Admin Alert
  await recordAdminAlert({
    uniqueKey: `referral_payout_${referral._id}`,
    type: "platform_fee",
    title: "Referral Rewards Distributed",
    description: `Referral rewards (₹${referrerReward} to ${referrer.name} & ₹${refereeReward} to ${referee.name}) credited.`,
    priority: "normal",
    dotColor: "emerald",
  });

  // Realtime Sockets
  if (io) {
    io.to(`user:${referrer._id}`).emit("referral-reward-earned", {
      amount: referrerReward,
      friendName: referee.name,
    });
    io.to(`user:${referee._id}`).emit("referral-reward-earned", {
      amount: refereeReward,
      isWelcomeBonus: true,
    });
  }
};

/**
 * Process referral rewards when a milestone is completed (first task payment released).
 * Checks both posterId and workerId to see if either has a pending referral.
 */
export const checkAndProcessReferralMilestone = async ({ posterId, workerId }) => {
  try {
    const candidates = [];
    if (posterId) candidates.push({ id: posterId, role: "poster" });
    if (workerId) candidates.push({ id: workerId, role: "worker" });

    await Promise.all(candidates.map((candidate) => processCandidateReferral(candidate)));
  } catch (error) {
    logger.error("checkAndProcessReferralMilestone error:", error.message);
  }
};

/**
 * Get referral stats, code, and history for the authenticated user.
 */
export const getUserReferralStatsService = async (userId) => {
  try {
    const user = await User.findById(userId).select("name referralCode referralStats activeRole");
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const referrals = await Referral.find({ referrerId: user._id })
      .populate("refereeId", "name email activeRole createdAt")
      .sort({ createdAt: -1 });

    const totalReferred = user.referralStats?.totalReferred || referrals.length;
    const totalEarnings = user.referralStats?.totalEarnings || 0;
    const completedCount = referrals.filter((r) => r.status === "completed").length;
    const pendingCount = referrals.filter((r) => r.status === "registered").length;

    const formattedReferrals = referrals.map((r) => ({
      id: r._id,
      refereeName: r.refereeId?.name || "Nexaro User",
      refereeRole: r.refereeId?.activeRole || "user",
      status: r.status,
      rewardAmount: r.referrerReward,
      date: r.createdAt,
      rewardedAt: r.rewardedAt,
    }));

    return {
      success: true,
      data: {
        referralCode: user.referralCode,
        stats: {
          totalReferred,
          totalEarnings,
          completedCount,
          pendingCount,
        },
        referrals: formattedReferrals,
      },
    };
  } catch (error) {
    logger.error("getUserReferralStatsService error:", error.message);
    return { success: false, message: error.message };
  }
};
