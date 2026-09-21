import mongoose from "mongoose";
import Transaction from "../models/transactionSchema.js";
import Task from "../models/taskSchema.js";

/**
 * Get payment statistics and overview for a poster:
 * - Total Spent (all-time released payments)
 * - Spent this month
 * - In Escrow (funds held safely for active tasks)
 * - Successfully Released (count & sum)
 * - Refunded (count & sum)
 */
export const getPosterPaymentOverviewService = async ({ userId }) => {
  try {
    const posterObjectId = new mongoose.Types.ObjectId(userId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Released payments (to_worker_wallet where sender is poster)
    const releasedTransactions = await Transaction.find({
      senderId: posterObjectId,
      transactionType: "to_worker_wallet",
      status: { $in: ["completed", "success"] },
    }).lean();

    const totalSpent = releasedTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const successfullyReleased = totalSpent;
    const releasedPaymentsCount = releasedTransactions.length;

    const spentThisMonth = releasedTransactions
      .filter((tx) => new Date(tx.createdAt || tx.processedAt) >= startOfMonth)
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);

    // 2. Active Escrow payments (either to_escrow transaction where task is still in progress,
    // or active tasks that are assigned/in_progress with accepted bid)
    const activeEscrowTasks = await Task.find({
      posterId: posterObjectId,
      status: { $in: ["assigned", "in_progress"] },
      acceptedBid: { $ne: null },
    })
      .populate("acceptedBid", "amount")
      .lean();

    const inEscrow = activeEscrowTasks.reduce(
      (sum, t) => sum + (t.acceptedBid?.amount || t.amount || 0),
      0
    );
    const escrowPaymentsCount = activeEscrowTasks.length;

    // 3. Cancelled/Refunded tasks
    const refundedTasks = await Task.find({
      posterId: posterObjectId,
      status: "cancelled",
      acceptedBid: { $ne: null },
    })
      .populate("acceptedBid", "amount")
      .lean();

    const refundedAmount = refundedTasks.reduce(
      (sum, t) => sum + (t.acceptedBid?.amount || t.amount || 0),
      0
    );
    const refundedCount = refundedTasks.length;

    return {
      success: true,
      stats: {
        totalSpent,
        spentThisMonth,
        inEscrow,
        escrowPaymentsCount,
        successfullyReleased,
        releasedPaymentsCount,
        refundedAmount,
        refundedCount,
      },
    };
  } catch (error) {
    console.error("getPosterPaymentOverviewService error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Get paginated payment and transaction history for poster
 */
export const getPosterPaymentHistoryService = async ({
  userId,
  page = 1,
  limit = 5,
  search = "",
  status = "all",
}) => {
  try {
    const posterObjectId = new mongoose.Types.ObjectId(userId);
    const skip = (Math.max(1, parseInt(page)) - 1) * Math.max(1, parseInt(limit));
    const searchRegex = search ? new RegExp(search.trim(), "i") : null;

    // Fetch all tasks posted by this user that have reached at least bid acceptance
    const taskQuery = {
      posterId: posterObjectId,
      status: { $in: ["assigned", "in_progress", "completed", "cancelled"] },
    };

    const tasks = await Task.find(taskQuery)
      .populate("workerId", "name email phone avatar verificationDocuments")
      .populate("acceptedBid", "amount createdAt")
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    // Map tasks and transactions into uniform payment history records
    const allRecords = [];

    for (const t of tasks) {
      const amount = t.acceptedBid?.amount || t.amount || 0;
      let recordStatus = "in_escrow"; // default for active jobs
      if (t.status === "completed") {
        recordStatus = "released";
      } else if (t.status === "cancelled") {
        recordStatus = "refunded";
      }

      // Filter by status if specified
      if (status !== "all" && status !== recordStatus) {
        continue;
      }

      const workerName = t.workerId?.name || "Assigned Worker";
      const workerAvatar =
        t.workerId?.verificationDocuments?.selfie?.url ||
        t.workerId?.avatar ||
        null;
      const workerEmail = t.workerId?.email || "";

      const txnId = `TXN #NX${t._id.toString().slice(-8).toUpperCase()}`;

      // Search filter
      if (
        searchRegex &&
        !searchRegex.test(t.title) &&
        !searchRegex.test(workerName) &&
        !searchRegex.test(txnId) &&
        !searchRegex.test(t.category || "")
      ) {
        continue;
      }

      const platformFee = Math.round(amount * 0.05);
      const netWorkerAmount = amount - platformFee;

      allRecords.push({
        id: t._id,
        taskId: t._id,
        taskTitle: t.title,
        category: t.category || "General",
        workerName,
        workerAvatar,
        workerEmail,
        workerId: t.workerId?._id || null,
        amount,
        platformFee,
        netWorkerAmount,
        status: recordStatus, // 'in_escrow' | 'released' | 'refunded'
        date: t.completedOn || t.updatedAt || t.createdAt,
        paymentMethod: "Nexaro Escrow (PayPal)",
        txnId,
        taskStatus: t.status,
        taskUpdate: t.update,
        canRelease: t.status === "in_progress" && t.update === "completed",
        bidId: t.acceptedBid?._id || null,
      });
    }

    const totalTransactions = allRecords.length;
    const totalPages = Math.ceil(totalTransactions / limit) || 1;
    const paginatedRecords = allRecords.slice(skip, skip + parseInt(limit));

    return {
      success: true,
      transactions: paginatedRecords,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        totalTransactions,
      },
    };
  } catch (error) {
    console.error("getPosterPaymentHistoryService error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Get spending trajectory chart data across 7D, 30D, 3M, 6M
 */
export const getPosterSpendingChartService = async ({ userId, timeframe = "30D" }) => {
  try {
    const posterObjectId = new mongoose.Types.ObjectId(userId);
    const normalizedTimeframe = (timeframe || "30D").toUpperCase();
    const now = new Date();
    let chartData = [];
    let totalSpentInPeriod = 0;

    // Fetch poster's released + in-escrow transactions
    const transactions = await Transaction.find({
      senderId: posterObjectId,
      status: { $in: ["completed", "success"] },
      transactionType: { $in: ["to_worker_wallet", "to_escrow"] },
    }).lean();

    if (normalizedTimeframe === "7D") {
      const dayMap = new Map();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
        const dateLabel = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
        dayMap.set(key, { name: dayName, date: dateLabel, amount: 0 });
      }

      transactions.forEach((tx) => {
        const key = new Date(tx.createdAt || tx.processedAt).toISOString().slice(0, 10);
        if (dayMap.has(key)) {
          dayMap.get(key).amount += tx.amount || 0;
          totalSpentInPeriod += tx.amount || 0;
        }
      });

      chartData = Array.from(dayMap.values());
    } else if (normalizedTimeframe === "30D") {
      const weeks = [
        { name: "Week 1", startDaysAgo: 27, endDaysAgo: 21 },
        { name: "Week 2", startDaysAgo: 20, endDaysAgo: 14 },
        { name: "Week 3", startDaysAgo: 13, endDaysAgo: 7 },
        { name: "Week 4", startDaysAgo: 6, endDaysAgo: 0 },
      ];

      chartData = weeks.map((w) => {
        const s = new Date(now.getTime() - w.startDaysAgo * 24 * 60 * 60 * 1000);
        s.setHours(0, 0, 0, 0);
        const e = new Date(now.getTime() - w.endDaysAgo * 24 * 60 * 60 * 1000);
        e.setHours(23, 59, 59, 999);

        const total = transactions
          .filter((tx) => {
            const txDate = new Date(tx.createdAt || tx.processedAt);
            return txDate >= s && txDate <= e;
          })
          .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        totalSpentInPeriod += total;
        return {
          name: w.name,
          date: `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${e.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
          amount: total,
        };
      });
    } else if (normalizedTimeframe === "3M" || normalizedTimeframe === "6M") {
      const monthsCount = normalizedTimeframe === "3M" ? 3 : 6;
      const monthMap = new Map();

      for (let i = monthsCount - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const name = d.toLocaleDateString("en-US", { month: "short" });
        const dateLabel = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        monthMap.set(key, { name, date: dateLabel, amount: 0 });
      }

      transactions.forEach((tx) => {
        const txDate = new Date(tx.createdAt || tx.processedAt);
        const key = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, "0")}`;
        if (monthMap.has(key)) {
          monthMap.get(key).amount += tx.amount || 0;
          totalSpentInPeriod += tx.amount || 0;
        }
      });

      chartData = Array.from(monthMap.values());
    }

    return {
      success: true,
      timeframe: normalizedTimeframe,
      totalSpent: totalSpentInPeriod,
      chartData,
    };
  } catch (error) {
    console.error("getPosterSpendingChartService error:", error.message);
    return { success: false, error: error.message };
  }
};
