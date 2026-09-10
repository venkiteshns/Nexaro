import mongoose from "mongoose";
import User from "../models/userSchema.js";
import Task from "../models/taskSchema.js";
import Transaction from "../models/transactionSchema.js";
import Order from "../models/orderSchema.js";
import AdminNotification from "../models/adminNotificationSchema.js";
import Announcement from "../models/announcementSchema.js";
import WorkerNotification from "../models/workerNotificationSchema.js";
import PosterNotification from "../models/posterNotificationSchema.js";
import Bid from "../models/bidsSchema.js";
import { getIo } from "../socket.js";
import { syncRealPlatformNotifications, recordAdminAlert } from "./adminNotificationHelper.js";
import MESSAGES from "../constants/messages.js";

export const getAllUsersService = async (page, limit) => {
    const skip = (page - 1) * limit;

    const users = await User.aggregate([
        {
            $match: { activeRole: { $ne: "admin" } }
        },
        {
            $lookup: {
                from: "tasks",
                localField: "_id",
                foreignField: "posterId",
                as: "tasks"
            }
        },
        {
            $addFields: {
                taskCount: { $size: "$tasks" }
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },
        {
            $project: {
                name: 1, email: 1, phone: 1, activeRole: 1, isVerified: 1, isSuspended: 1, createdAt: 1, skills: 1, location: 1, verificationDocuments: 1, taskCount: 1,
            }
        },
    ])
    const totalUsers = await User.countDocuments({ activeRole: { $ne: "admin" } });
    const totalPages = Math.ceil(totalUsers / limit);
    return {
        success: true,
        users,
        currentPage: page,
        totalPages,
        totalUsers,
    };
};

export const suspendUserService = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        return { success: false, message: MESSAGES.USER_NOT_FOUND };
    }

    if (user.isSuspended) {
        return { success: false, message: MESSAGES.USER_ALREADY_SUSPENDED };
    }

    user.isSuspended = true;
    await user.save({ validateBeforeSave: false });

    return { success: true, message: MESSAGES.USER_SUSPENDED };
};

export const unsuspendUserService = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        return { success: false, message: MESSAGES.USER_NOT_FOUND };
    }

    if (!user.isSuspended) {
        return { success: false, message: MESSAGES.USER_NOT_SUSPENDED };
    }

    user.isSuspended = false;
    await user.save({ validateBeforeSave: false });

    return { success: true, message: MESSAGES.USER_UNSUSPENDED };
};

export const getPendingVerificationUsersService = async (page, limit) => {
    const skip = (page - 1) * limit;

    const users = await User.find({
        activeRole: { $ne: "admin" },
        isVerified: false,
        isSuspended: false,
    })
        .select("name email phone activeRole isVerified isSuspended createdAt skills location verificationDocuments")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments({
        activeRole: { $ne: "admin" },
        isVerified: false,
        isSuspended: false,
    });

    const totalPages = Math.ceil(totalUsers / limit);

    return {
        success: true,
        users,
        currentPage: page,
        totalPages,
        totalUsers,
    };
};

export const approveUserService = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        return { success: false, message: MESSAGES.USER_NOT_FOUND };
    }

    if (user.isVerified) {
        return { success: false, message: MESSAGES.USER_ALREADY_VERIFIED };
    }

    user.isVerified = true;
    await user.save({ validateBeforeSave: false });

    return { success: true, message: MESSAGES.USER_APPROVED };
};

export const rejectUserService = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        return { success: false, message: MESSAGES.USER_NOT_FOUND };
    }

    user.isSuspended = true;
    await user.save({ validateBeforeSave: false });

    return { success: true, message: MESSAGES.USER_REJECTED };
};

export const getAllTasksService = async (page, limit, search = '', status = 'all', category = 'all') => {
    const skip = (page - 1) * limit;

    // ── Build the filtered $match (applied to paginated tasks + totalCount) ──
    const filterMatch = {};
    if (status && status !== 'all') filterMatch.status = status;
    if (category && category !== 'all') filterMatch.category = category;

    // ── Search is applied via a $lookup + $or after joining poster ──
    const searchRegex = search ? new RegExp(search, 'i') : null;

    const [result] = await Task.aggregate([
        // Apply status + category match first (DB-level, indexed)
        ...(Object.keys(filterMatch).length ? [{ $match: filterMatch }] : []),
        {
            $facet: {
                // ── Paginated tasks with poster + search filter ──
                tasks: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'posterId',
                            foreignField: '_id',
                            as: 'posterId',
                            pipeline: [{ $project: { name: 1, email: 1 } }],
                        },
                    },
                    { $unwind: { path: '$posterId', preserveNullAndEmptyArrays: true } },
                    // Apply search filter after poster is joined
                    ...(searchRegex ? [{
                        $match: {
                            $or: [
                                { title: { $regex: searchRegex } },
                                { 'posterId.name': { $regex: searchRegex } },
                            ],
                        },
                    }] : []),
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                ],
                // ── Total count of filtered results ──
                totalCount: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'posterId',
                            foreignField: '_id',
                            as: 'posterId',
                            pipeline: [{ $project: { name: 1 } }],
                        },
                    },
                    { $unwind: { path: '$posterId', preserveNullAndEmptyArrays: true } },
                    ...(searchRegex ? [{
                        $match: {
                            $or: [
                                { title: { $regex: searchRegex } },
                                { 'posterId.name': { $regex: searchRegex } },
                            ],
                        },
                    }] : []),
                    { $count: 'count' },
                ],
                // ── Platform-wide status counts (no search/category applied) ──
                statusCounts: [
                    { $group: { _id: '$status', count: { $sum: 1 } } },
                ],
            },
        },
    ]);

    const tasks = result.tasks || [];
    const totalTasks = result.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalTasks / limit) || 1;
    const categories = await Task.distinct("category");

    const statusCounts = { open: 0, assigned: 0, in_progress: 0, completed: 0, cancelled: 0 };
    for (const { _id, count } of result.statusCounts || []) {
        if (_id && Object.prototype.hasOwnProperty.call(statusCounts, _id)) {
            statusCounts[_id] = count;
        }
    }

    return {
        success: true,
        tasks,
        currentPage: page,
        totalPages,
        totalTasks,
        statusCounts,
        categories,
    };

};

export const cancelTaskByAdminService = async (taskId) => {
    const task = await Task.findById(taskId);
    if (!task) {
        return { error: MESSAGES.TASK_NOT_FOUND };
    }

    task.status = "cancelled";
    await task.save({ validateBeforeSave: false });

    await recordAdminAlert({
        uniqueKey: `task_cancelled_${task._id}`,
        type: "task_cancelled",
        title: "Task Cancelled",
        description: `Task "${task.title}" was cancelled by Admin.`,
        priority: "normal",
        dotColor: "rose",
        metadata: { taskId: task._id },
    });

    return { success: true, message: MESSAGES.TASK_CANCELLED };
}

export const getAdminTaskDetailsService = async (taskId) => {
    const [result] = await Task.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(taskId) } },

        {
            $lookup: {
                from: 'users',
                localField: 'posterId',
                foreignField: '_id',
                as: 'poster',
                pipeline: [{ $project: { name: 1, email: 1, phone: 1, selfie: '$verificationDocuments.selfie.url' } }],
            },
        },
        { $unwind: { path: '$poster', preserveNullAndEmptyArrays: true } },

        {
            $lookup: {
                from: 'users',
                localField: 'workerId',
                foreignField: '_id',
                as: 'worker',
                pipeline: [{ $project: { name: 1, email: 1, phone: 1, rating: '$worker.rating', selfie: '$verificationDocuments.selfie.url', isVerified: 1 } }],
            },
        },
        { $unwind: { path: '$worker', preserveNullAndEmptyArrays: true } },

        {
            $lookup: {
                from: 'bids',
                localField: 'acceptedBid',
                foreignField: '_id',
                as: 'bid',
                pipeline: [{ $project: { amount: 1, eta: 1, pitch: 1 } }],
            },
        },
        { $unwind: { path: '$bid', preserveNullAndEmptyArrays: true } },

        {
            $lookup: {
                from: 'bids',
                localField: '_id',
                foreignField: 'taskId',
                as: 'allBids',
            },
        },
        { $addFields: { bidCount: { $size: '$allBids' } } },
        { $project: { allBids: 0 } },
    ]);

    if (!result) return { error: 'Task not found' };

    return { success: true, task: result };
};

const getRangeDates = (range) => {
    const now = new Date();
    let currentStart = null;
    let currentEnd = now;
    let prevStart = null;
    let prevEnd = null;

    switch (range) {
        case "Today": {
            currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            prevEnd = new Date(currentStart.getTime());
            prevStart = new Date(currentStart.getTime() - (24 * 60 * 60 * 1000));
            break;
        }
        case "Last 7 Days": {
            const ms = 7 * 24 * 60 * 60 * 1000;
            currentStart = new Date(now.getTime() - ms);
            prevEnd = new Date(currentStart.getTime());
            prevStart = new Date(currentStart.getTime() - ms);
            break;
        }
        case "Last 30 Days": {
            const ms = 30 * 24 * 60 * 60 * 1000;
            currentStart = new Date(now.getTime() - ms);
            prevEnd = new Date(currentStart.getTime());
            prevStart = new Date(currentStart.getTime() - ms);
            break;
        }
        case "Last 90 Days": {
            const ms = 90 * 24 * 60 * 60 * 1000;
            currentStart = new Date(now.getTime() - ms);
            prevEnd = new Date(currentStart.getTime());
            prevStart = new Date(currentStart.getTime() - ms);
            break;
        }
        case "This Year": {
            currentStart = new Date(now.getFullYear(), 0, 1);
            prevEnd = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
            prevStart = new Date(now.getFullYear() - 1, 0, 1);
            break;
        }
        case "All Time":
        default: {
            currentStart = null;
            currentEnd = null;
            prevStart = null;
            prevEnd = null;
            break;
        }
    }
    return { currentStart, currentEnd, prevStart, prevEnd };
};

// ── 1. Admin Finance Overview Stats Service ─────────────────────────
export const getAdminFinanceStatsService = async (range = "Last 30 Days") => {
    const { currentStart, currentEnd } = getRangeDates(range);

    const fetchPeriodData = async (start, end) => {
        const match = { status: { $in: ["completed", "success"] } };
        if (start && end) {
            match.createdAt = { $gte: start, $lte: end };
        } else if (start) {
            match.createdAt = { $gte: start };
        }

        const gmvAgg = await Transaction.aggregate([
            { $match: { ...match, transactionType: "to_escrow" } },
            { $group: { _id: null, totalGmv: { $sum: "$amount" }, count: { $sum: 1 } } },
        ]);

        const totalGmv = gmvAgg[0]?.totalGmv || 0;
        const completedEscrowCount = gmvAgg[0]?.count || 0;

        const feeAgg = await Transaction.aggregate([
            { $match: { ...match, transactionType: "platform_fee" } },
            { $group: { _id: null, totalFee: { $sum: "$amount" } } },
        ]);
        const directFee = feeAgg[0]?.totalFee || 0;
        const netRevenue = Math.max(directFee, Math.round(totalGmv * 0.05 * 100) / 100);

        const avgTransaction = completedEscrowCount > 0 ? Math.round((totalGmv / completedEscrowCount) * 100) / 100 : 0;
        const totalTransactions = await Transaction.countDocuments(match);

        return { totalGmv, netRevenue, avgTransaction, totalTransactions, completedEscrowCount };
    };

    const current = await fetchPeriodData(currentStart, currentEnd);

    const stats = [
        {
            id: "gmv",
            label: "Total GMV",
            value: `₹${current.totalGmv.toLocaleString("en-IN")}`,
            rawAmount: current.totalGmv,
            subtext: "Gross booking volume",
            accentColor: "from-emerald-500 to-teal-600",
            indicatorColor: "bg-emerald-500",
        },
        {
            id: "net_revenue",
            label: "Net Revenue",
            value: `₹${current.netRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            rawAmount: current.netRevenue,
            subtext: "Platform commission (5%)",
            accentColor: "from-[#0A6E5C] to-emerald-600",
            indicatorColor: "bg-[#0A6E5C]",
        },
        {
            id: "avg_transaction",
            label: "Avg. Transaction",
            value: `₹${current.avgTransaction.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            rawAmount: current.avgTransaction,
            subtext: "Per booking average",
            accentColor: "from-teal-500 to-emerald-400",
            indicatorColor: "bg-teal-500",
        },
        {
            id: "total_transactions",
            label: "Total Transactions",
            value: current.totalTransactions.toLocaleString("en-IN"),
            rawAmount: current.totalTransactions,
            subtext: `${current.completedEscrowCount} bookings completed`,
            accentColor: "from-emerald-600 to-[#0A6E5C]",
            indicatorColor: "bg-emerald-600",
        },
    ];

    return {
        success: true,
        range,
        stats,
        rawStats: current,
    };
};

// ── 2. Admin Revenue Trends Chart Service ───────────────────────────
export const getAdminFinanceChartService = async (timeframe = "7D", metric = "revenue") => {
    const normalizedTimeframe = (timeframe || "7D").toUpperCase();
    const normalizedMetric = (metric || "revenue").toLowerCase();
    const now = new Date();
    let chartData = [];
    let startDate;

    if (normalizedTimeframe === "7D") {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);

        const dayMap = new Map();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
            const dateLabel = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
            dayMap.set(key, { name: dayName, date: dateLabel, gmv: 0, revenue: 0, volume: 0 });
        }

        const txs = await Transaction.find({
            status: { $in: ["completed", "success"] },
            createdAt: { $gte: startDate },
        });

        txs.forEach((tx) => {
            const key = new Date(tx.createdAt).toISOString().slice(0, 10);
            if (dayMap.has(key)) {
                const item = dayMap.get(key);
                if (tx.transactionType === "to_escrow") {
                    item.gmv += tx.amount;
                    item.revenue += Math.round(tx.amount * 0.05 * 100) / 100;
                    item.volume += 1;
                }
            }
        });

        chartData = Array.from(dayMap.values());
    } else if (normalizedTimeframe === "1M") {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 27);
        startDate.setHours(0, 0, 0, 0);

        const weeks = [
            { name: "Week 1", startDaysAgo: 27, endDaysAgo: 21 },
            { name: "Week 2", startDaysAgo: 20, endDaysAgo: 14 },
            { name: "Week 3", startDaysAgo: 13, endDaysAgo: 7 },
            { name: "Week 4", startDaysAgo: 6, endDaysAgo: 0 },
        ];

        const weekBuckets = weeks.map((w) => {
            const s = new Date(now);
            s.setDate(now.getDate() - w.startDaysAgo);
            s.setHours(0, 0, 0, 0);

            const e = new Date(now);
            e.setDate(now.getDate() - w.endDaysAgo);
            e.setHours(23, 59, 59, 999);

            const dateLabel = `${s.toLocaleDateString("en-US", { day: "numeric", month: "short" })} - ${e.toLocaleDateString("en-US", { day: "numeric", month: "short" })}`;

            return {
                name: w.name,
                date: dateLabel,
                start: s,
                end: e,
                gmv: 0,
                revenue: 0,
                volume: 0,
            };
        });

        const txs = await Transaction.find({
            status: { $in: ["completed", "success"] },
            createdAt: { $gte: startDate },
        });

        txs.forEach((tx) => {
            if (tx.transactionType === "to_escrow") {
                const txTime = new Date(tx.createdAt).getTime();
                const bucket = weekBuckets.find(
                    (b) => txTime >= b.start.getTime() && txTime <= b.end.getTime()
                );
                if (bucket) {
                    bucket.gmv += tx.amount;
                    bucket.revenue += Math.round(tx.amount * 0.05 * 100) / 100;
                    bucket.volume += 1;
                }
            }
        });

        chartData = weekBuckets.map(({ name, date, gmv, revenue, volume }) => ({
            name,
            date,
            gmv,
            revenue,
            volume,
        }));
    } else {
        // "6M", "1Y", or "ALL"
        const monthsCount = normalizedTimeframe === "6M" ? 6 : normalizedTimeframe === "1Y" ? 12 : 12;
        startDate = new Date(now.getFullYear(), now.getMonth() - (monthsCount - 1), 1);

        const monthMap = new Map();
        for (let i = monthsCount - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            const name = d.toLocaleDateString("en-US", { month: "short" });
            const dateLabel = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
            monthMap.set(key, { name, date: dateLabel, gmv: 0, revenue: 0, volume: 0 });
        }

        const txs = await Transaction.find({
            status: { $in: ["completed", "success"] },
            ...(normalizedTimeframe !== "ALL" ? { createdAt: { $gte: startDate } } : {}),
        });

        txs.forEach((tx) => {
            if (tx.transactionType === "to_escrow") {
                const d = new Date(tx.createdAt);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                if (monthMap.has(key)) {
                    const item = monthMap.get(key);
                    item.gmv += tx.amount;
                    item.revenue += Math.round(tx.amount * 0.05 * 100) / 100;
                    item.volume += 1;
                }
            }
        });

        chartData = Array.from(monthMap.values());
    }

    let totalRevenue = 0;
    let totalGmv = 0;
    let totalVolume = 0;

    chartData = chartData.map((item) => {
        totalRevenue += item.revenue;
        totalGmv += item.gmv;
        totalVolume += item.volume;

        let value = item.revenue;
        if (normalizedMetric === "gmv") value = item.gmv;
        if (normalizedMetric === "volume" || normalizedMetric === "orders") value = item.volume;

        return {
            ...item,
            value,
            earnings: value, // for compatibility with shared chart component
        };
    });

    return {
        success: true,
        timeframe: normalizedTimeframe,
        metric: normalizedMetric,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalGmv: Math.round(totalGmv * 100) / 100,
        totalVolume,
        chartData,
    };
};

// ── 3. Admin Finance Transactions Table Service ─────────────────────
export const getAdminFinanceTransactionsService = async ({
    page = 1,
    limit = 10,
    search = "",
    status = "ALL",
    range = "All Time",
}) => {
    const skip = (page - 1) * limit;

    const match = {};

    if (status && status !== "ALL") {
        match.status = status.toLowerCase();
    }

    if (range && range !== "All Time") {
        const { currentStart, currentEnd } = getRangeDates(range);
        if (currentStart) {
            match.createdAt = { $gte: currentStart, ...(currentEnd ? { $lte: currentEnd } : {}) };
        }
    }

    const searchRegex = search ? new RegExp(search, "i") : null;

    const pipeline = [
        ...(Object.keys(match).length ? [{ $match: match }] : []),
        {
            $addFields: {
                idStr: { $toString: "$_id" },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "senderId",
                foreignField: "_id",
                as: "sender",
                pipeline: [{ $project: { name: 1, email: 1 } }],
            },
        },
        { $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "users",
                localField: "receiverId",
                foreignField: "_id",
                as: "receiver",
                pipeline: [{ $project: { name: 1, email: 1 } }],
            },
        },
        { $unwind: { path: "$receiver", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "orders",
                localField: "orderId",
                foreignField: "_id",
                as: "order",
            },
        },
        { $unwind: { path: "$order", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "bids",
                localField: "order.bidId",
                foreignField: "_id",
                as: "bid",
            },
        },
        { $unwind: { path: "$bid", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "tasks",
                localField: "bid.taskId",
                foreignField: "_id",
                as: "task",
                pipeline: [{ $project: { title: 1, category: 1 } }],
            },
        },
        { $unwind: { path: "$task", preserveNullAndEmptyArrays: true } },
        ...(searchRegex
            ? [
                {
                    $match: {
                        $or: [
                            { idStr: { $regex: searchRegex } },
                            { "sender.name": { $regex: searchRegex } },
                            { "sender.email": { $regex: searchRegex } },
                            { "receiver.name": { $regex: searchRegex } },
                            { "receiver.email": { $regex: searchRegex } },
                            { "task.title": { $regex: searchRegex } },
                            { payoutEmail: { $regex: searchRegex } },
                            { transactionType: { $regex: searchRegex } },
                        ],
                    },
                },
            ]
            : []),
        {
            $facet: {
                transactions: [
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                ],
                totalCount: [{ $count: "count" }],
            },
        },
    ];

    const [result] = await Transaction.aggregate(pipeline);

    const transactions = (result?.transactions || []).map((tx) => {
        const user = tx.sender || tx.receiver || { name: "Platform User", email: "" };
        const initials = user.name
            ? user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            : "NA";

        let taskTitle = tx.task?.title;
        if (!taskTitle) {
            if (tx.transactionType === "to_worker") taskTitle = `Worker Payout (${tx.payoutEmail || "PayPal"})`;
            else if (tx.transactionType === "platform_fee") taskTitle = "Platform Commission Fee";
            else if (tx.transactionType === "to_worker_wallet") taskTitle = "Wallet Credit";
            else taskTitle = "Service Booking";
        }

        const rawAmount = tx.amount || 0;
        const rawCommission =
            tx.transactionType === "platform_fee"
                ? rawAmount
                : tx.transactionType === "to_escrow"
                    ? Math.round(rawAmount * 0.05 * 100) / 100
                    : 0;

        const d = new Date(tx.createdAt);
        const dateFormatted = d.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

        return {
            id: `#TXN-${tx._id.toString().slice(-6).toUpperCase()}`,
            rawId: tx._id.toString(),
            transactionType: tx.transactionType,
            user: {
                name: user.name || "Unknown",
                initials,
                email: user.email || "",
            },
            task: taskTitle,
            category: tx.task?.category || "General",
            amount: `₹${rawAmount.toLocaleString("en-IN")}`,
            rawAmount,
            commission: `₹${rawCommission.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            rawCommission,
            status: (tx.status || "COMPLETED").toUpperCase(),
            date: dateFormatted,
            createdAt: tx.createdAt,
        };
    });

    const totalTransactions = result?.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalTransactions / limit) || 1;

    return {
        success: true,
        transactions,
        totalTransactions,
        currentPage: page,
        totalPages,
    };
};

// ── 4. Admin Daily Revenue Report Service ───────────────────────────
export const getAdminDailyRevenueReportService = async () => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const match = {
        status: { $in: ["completed", "success"] },
        createdAt: { $gte: startOfToday, $lte: endOfToday },
    };

    const gmvAgg = await Transaction.aggregate([
        { $match: { ...match, transactionType: "to_escrow" } },
        { $group: { _id: null, totalGmv: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);
    const totalGmv = gmvAgg[0]?.totalGmv || 0;
    const completedEscrowCount = gmvAgg[0]?.count || 0;

    const feeAgg = await Transaction.aggregate([
        { $match: { ...match, transactionType: "platform_fee" } },
        { $group: { _id: null, totalFee: { $sum: "$amount" } } },
    ]);
    const directFee = feeAgg[0]?.totalFee || 0;
    const netRevenue = Math.max(directFee, Math.round(totalGmv * 0.05 * 100) / 100);

    const workerAgg = await Transaction.aggregate([
        { $match: { ...match, transactionType: { $in: ["to_worker", "to_worker_wallet"] } } },
        { $group: { _id: null, totalPayout: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);
    const totalWorkerPayouts = workerAgg[0]?.totalPayout || 0;
    const totalTransactionsToday = await Transaction.countDocuments(match);

    const recentTodayTxs = await Transaction.find(match)
        .sort({ createdAt: -1 })
        .limit(20);

    return {
        success: true,
        reportType: "daily_revenue",
        generatedAt: new Date().toISOString(),
        dateLabel: new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
        summary: {
            totalGmv,
            netRevenue,
            totalWorkerPayouts,
            totalTransactionsToday,
            completedEscrowCount,
            formattedGmv: `₹${totalGmv.toLocaleString("en-IN")}`,
            formattedRevenue: `₹${netRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            formattedPayouts: `₹${totalWorkerPayouts.toLocaleString("en-IN")}`,
        },
        transactions: recentTodayTxs.map((t) => ({
            id: `#TXN-${t._id.toString().slice(-6).toUpperCase()}`,
            amount: t.amount,
            type: t.transactionType,
            status: t.status,
            time: new Date(t.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        })),
    };
};

// ── 5. Admin Monthly P&L Report Service ─────────────────────────────
export const getAdminMonthlyPlReportService = async (yearParam, monthParam) => {
    const now = new Date();
    const year = parseInt(yearParam) || now.getFullYear();
    const month = monthParam !== undefined && monthParam !== null && monthParam !== "" ? parseInt(monthParam) : now.getMonth();

    const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const match = {
        status: { $in: ["completed", "success"] },
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    };

    const gmvAgg = await Transaction.aggregate([
        { $match: { ...match, transactionType: "to_escrow" } },
        { $group: { _id: null, totalGmv: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);
    const grossVolume = gmvAgg[0]?.totalGmv || 0;
    const completedTasksCount = gmvAgg[0]?.count || 0;

    const workerAgg = await Transaction.aggregate([
        { $match: { ...match, transactionType: { $in: ["to_worker", "to_worker_wallet"] } } },
        { $group: { _id: null, totalPayouts: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);
    const workerPayouts = workerAgg[0]?.totalPayouts || 0;

    const feeAgg = await Transaction.aggregate([
        { $match: { ...match, transactionType: "platform_fee" } },
        { $group: { _id: null, totalFee: { $sum: "$amount" } } },
    ]);
    const directFee = feeAgg[0]?.totalFee || 0;
    const platformCommission = Math.max(directFee, Math.round(grossVolume * 0.05 * 100) / 100);

    const netProfit = platformCommission;
    const profitMargin = grossVolume > 0 ? ((platformCommission / grossVolume) * 100).toFixed(1) : "5.0";

    const monthName = startOfMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return {
        success: true,
        reportType: "monthly_pl",
        monthName,
        year,
        month,
        generatedAt: new Date().toISOString(),
        metrics: {
            grossVolume,
            workerPayouts,
            platformCommission,
            netProfit,
            profitMargin: `${profitMargin}%`,
            completedTasksCount,
            formattedGmv: `₹${grossVolume.toLocaleString("en-IN")}`,
            formattedPayouts: `₹${workerPayouts.toLocaleString("en-IN")}`,
            formattedCommission: `₹${platformCommission.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            formattedNetProfit: `₹${netProfit.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
    };
};

// ── 6. Admin Platform Fee Summary Service ───────────────────────────
export const getAdminPlatformFeeSummaryService = async () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const fiscalStartYear = now.getMonth() >= 3 ? currentYear : currentYear - 1;
    const fiscalStartDate = new Date(fiscalStartYear, 3, 1, 0, 0, 0, 0);

    const matchFY = {
        status: { $in: ["completed", "success"] },
        createdAt: { $gte: fiscalStartDate },
    };

    const gmvAgg = await Transaction.aggregate([
        { $match: { ...matchFY, transactionType: "to_escrow" } },
        { $group: { _id: null, totalGmv: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);
    const fyGmv = gmvAgg[0]?.totalGmv || 0;
    const fyCount = gmvAgg[0]?.count || 0;

    const feeAgg = await Transaction.aggregate([
        { $match: { ...matchFY, transactionType: "platform_fee" } },
        { $group: { _id: null, totalFee: { $sum: "$amount" } } },
    ]);
    const directFyFee = feeAgg[0]?.totalFee || 0;
    const fyPlatformFee = Math.max(directFyFee, Math.round(fyGmv * 0.05 * 100) / 100);

    const allGmvAgg = await Transaction.aggregate([
        { $match: { status: { $in: ["completed", "success"] }, transactionType: "to_escrow" } },
        { $group: { _id: null, totalGmv: { $sum: "$amount" } } },
    ]);
    const allTimeGmv = allGmvAgg[0]?.totalGmv || 0;
    const allTimeFee = Math.round(allTimeGmv * 0.05 * 100) / 100;

    const formatCurrencyShort = (amount) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
        if (amount >= 1000000) return `₹${(amount / 1000000).toFixed(2)}M`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
        return `₹${amount.toLocaleString("en-IN")}`;
    };

    const formattedAmount = fyPlatformFee > 0 ? formatCurrencyShort(fyPlatformFee) : "₹0";

    return {
        success: true,
        reportType: "platform_fee_summary",
        fiscalYear: `FY ${fiscalStartYear}-${(fiscalStartYear + 1).toString().slice(-2)}`,
        rawAmount: fyPlatformFee || 0,
        formattedAmount,
        commissionRate: "5%",
        totalGmv: fyGmv,
        totalTransactions: fyCount,
        allTimeFee,
        generatedAt: new Date().toISOString(),
    };
};

export const getAdminNotificationsService = async (page = 1, limit = 6, filter = "all") => {
    // Keep notifications synchronized with real database tasks, transactions, bids, reviews
    await syncRealPlatformNotifications();

    const query = {};
    if (filter === "unread") {
        query.isRead = false;
    } else if (filter === "read") {
        query.isRead = true;
    }

    const skip = (page - 1) * limit;
    const [notifications, totalCount, unreadCount] = await Promise.all([
        AdminNotification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        AdminNotification.countDocuments(query),
        AdminNotification.countDocuments({ isRead: false }),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return {
        success: true,
        notifications,
        currentPage: Number(page),
        totalPages,
        totalCount,
        unreadCount,
    };
};

export const markAllNotificationsReadService = async () => {
    await AdminNotification.updateMany({ isRead: false }, { $set: { isRead: true } });
    return {
        success: true,
        message: "All notifications marked as read",
    };
};

export const markNotificationReadService = async (notificationId) => {
    const notification = await AdminNotification.findByIdAndUpdate(
        notificationId,
        { $set: { isRead: true } },
        { new: true }
    );
    if (!notification) {
        return { success: false, message: "Notification not found" };
    }
    return {
        success: true,
        notification,
    };
};

export const sendAnnouncementService = async ({ targetAudience = "ALL USERS", title, message, adminId = null }) => {
    if (!title || !message) {
        return { success: false, message: "Title and message are required" };
    }

    const announcement = await Announcement.create({
        targetAudience,
        title: title.trim(),
        message: message.trim(),
        sentBy: adminId || null,
    });

    // Also record as a system notification alert for admin audit records (marked read)
    await AdminNotification.create({
        type: "announcement",
        title: `Announcement: ${title.trim()}`,
        description: `Broadcasted to ${targetAudience}: "${message.trim().slice(0, 80)}${message.trim().length > 80 ? "..." : ""}"`,
        priority: "normal",
        dotColor: "emerald",
        isRead: true,
    });

    const audience = (targetAudience || "ALL USERS").trim().toUpperCase();
    const isForPosters = audience === "POSTERS" || audience === "POSTER" || audience === "ALL USERS" || audience === "ALL";
    const isForWorkers = audience === "WORKERS" || audience === "WORKER" || audience === "ALL USERS" || audience === "ALL";

    // 1. If target audience includes posters, persist to PosterNotification
    if (isForPosters) {
        try {
            const posters = await User.find({
                $or: [{ role: "poster" }, { activeRole: "poster" }],
                isDeleted: { $ne: true },
            }).select("_id").lean();

            if (posters.length > 0) {
                const bulkOps = posters.map((p) => ({
                    updateOne: {
                        filter: { uniqueKey: `p_${p._id}_ann_${announcement._id}` },
                        update: {
                            $setOnInsert: {
                                posterId: p._id,
                                uniqueKey: `p_${p._id}_ann_${announcement._id}`,
                                type: "announcement",
                                category: "system",
                                title: announcement.title,
                                description: announcement.message,
                                actionLink: null,
                                actionLabel: null,
                                dotColor: "emerald",
                                createdAt: announcement.createdAt,
                                metadata: { announcementId: announcement._id },
                                isRead: false,
                            },
                        },
                        upsert: true,
                    },
                }));
                await PosterNotification.bulkWrite(bulkOps, { ordered: false });
            }
        } catch (posterNotifErr) {
            console.error("Error creating poster notifications for announcement:", posterNotifErr.message);
        }
    }

    // 2. If target audience includes workers, persist to WorkerNotification
    if (isForWorkers) {
        try {
            const workers = await User.find({
                $or: [{ role: "worker" }, { activeRole: "worker" }],
                isDeleted: { $ne: true },
            }).select("_id").lean();

            if (workers.length > 0) {
                const bulkOps = workers.map((w) => ({
                    updateOne: {
                        filter: { uniqueKey: `w_${w._id}_ann_${announcement._id}` },
                        update: {
                            $setOnInsert: {
                                workerId: w._id,
                                uniqueKey: `w_${w._id}_ann_${announcement._id}`,
                                type: "announcement",
                                category: "system",
                                title: announcement.title,
                                description: announcement.message,
                                actionLink: null,
                                actionLabel: null,
                                dotColor: "emerald",
                                createdAt: announcement.createdAt,
                                metadata: { announcementId: announcement._id },
                                isRead: false,
                            },
                        },
                        upsert: true,
                    },
                }));
                await WorkerNotification.bulkWrite(bulkOps, { ordered: false });
            }
        } catch (workerNotifErr) {
            console.error("Error creating worker notifications for announcement:", workerNotifErr.message);
        }
    }

    // 3. Broadcast via socket strictly to targeted recipient rooms (NEVER broadcast to admin)
    try {
        const io = getIo();
        if (io) {
            const payload = {
                id: announcement._id,
                title: announcement.title,
                message: announcement.message,
                targetAudience: announcement.targetAudience,
                createdAt: announcement.createdAt,
            };

            if (audience === "WORKERS" || audience === "WORKER") {
                io.to("role:worker").emit("admin-announcement", payload);
            } else if (audience === "POSTERS" || audience === "POSTER") {
                io.to("role:poster").emit("admin-announcement", payload);
            } else {
                // ALL USERS: Target both worker and poster rooms specifically (excludes admin)
                io.to("role:worker").to("role:poster").emit("admin-announcement", payload);
            }
        }
    } catch (socketErr) {
        console.warn("Socket notification could not be broadcasted:", socketErr.message);
    }

    return {
        success: true,
        message: "Announcement sent successfully",
        announcement,
    };
};

export const getRecentAnnouncementsService = async (limit = 5) => {
    // Purge default sample announcement and any linked records
    await Promise.all([
        Announcement.deleteMany({ title: "New Bonus Program" }),
        AdminNotification.deleteMany({ title: { $regex: /New Bonus Program/i } }),
        WorkerNotification.deleteMany({ title: "New Bonus Program" }),
        PosterNotification.deleteMany({ title: "New Bonus Program" }),
    ]);

    const announcements = await Announcement.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return {
        success: true,
        announcements,
    };
};

export const getAdminDashboardService = async () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLast7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
        totalUsers,
        activeTasks,
        pendingVerifications,
        pendingPayouts,
        flaggedCount,
        todayTransactions,
        monthTransactions,
        recent7DaysTransactions,
        recentMonthTransactions,
        completedTasksCount,
        totalTasksCount,
        recentSignups,
        onlineWorkersCount,
        tasksTodayCount,
        bidsTodayCount,
        totalBidsCount,
        recentTasks,
        recentWorkers,
        recentPayouts,
        recentVerifUsers,
        recentAlerts,
    ] = await Promise.all([
        User.countDocuments({ activeRole: { $ne: "admin" }, isDeleted: { $ne: true } }),
        Task.countDocuments({ status: { $in: ["open", "assigned", "in_progress"] } }),
        User.countDocuments({ isVerified: false, "verificationDocuments.selfie.url": { $exists: true }, isDeleted: { $ne: true } }),
        Transaction.countDocuments({ transactionType: { $in: ["to_worker", "to_worker_wallet"] }, status: "pending" }),
        User.countDocuments({ isSuspended: true }),
        Transaction.find({
            transactionType: "platform_fee",
            createdAt: { $gte: startOfToday },
            status: { $in: ["completed", "success"] },
        }).lean(),
        Transaction.find({
            transactionType: "platform_fee",
            createdAt: { $gte: startOfMonth },
            status: { $in: ["completed", "success"] },
        }).lean(),
        Transaction.find({
            transactionType: "platform_fee",
            createdAt: { $gte: startOfLast7Days },
            status: { $in: ["completed", "success"] },
        }).lean(),
        Transaction.find({
            transactionType: "platform_fee",
            createdAt: { $gte: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000) },
            status: { $in: ["completed", "success"] },
        }).lean(),
        Task.countDocuments({ status: "completed" }),
        Task.countDocuments(),
        User.find({ activeRole: { $ne: "admin" }, isDeleted: { $ne: true } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name activeRole createdAt")
            .lean(),
        User.countDocuments({ activeRole: "worker", "worker.isLive": true, isDeleted: { $ne: true } }),
        Task.countDocuments({ createdAt: { $gte: startOfToday } }),
        Bid.countDocuments({ createdAt: { $gte: startOfToday } }),
        Bid.countDocuments(),
        Task.find().sort({ createdAt: -1 }).limit(3).lean(),
        User.find({ activeRole: "worker" }).sort({ createdAt: -1 }).limit(2).lean(),
        Transaction.find({ transactionType: { $in: ["to_worker", "to_worker_wallet"] } }).populate("receiverId", "name").sort({ createdAt: -1 }).limit(2).lean(),
        User.find({ "verificationDocuments.selfie.url": { $exists: true } }).sort({ updatedAt: -1 }).limit(2).lean(),
        AdminNotification.find().sort({ createdAt: -1 }).limit(3).lean(),
    ]);

    const revenueTodayAmount = todayTransactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);
    const revenueMonthAmount = monthTransactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);

    const successRate = totalTasksCount > 0
        ? Math.min(100, Math.round((completedTasksCount / totalTasksCount) * 100))
        : 0;

    const avgBidsPerTask = totalTasksCount > 0
        ? (totalBidsCount / totalTasksCount).toFixed(1)
        : "0";

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekTrajectory = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
        const dayName = daysOfWeek[d.getDay()];

        const dayTotal = recent7DaysTransactions
            .filter((tx) => new Date(tx.createdAt) >= dayStart && new Date(tx.createdAt) <= dayEnd)
            .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        weekTrajectory.push({
            day: dayName,
            date: dayStart.toISOString(),
            amount: dayTotal,
        });
    }

    const weeks = [
        { name: "Week 1", startDaysAgo: 27, endDaysAgo: 21 },
        { name: "Week 2", startDaysAgo: 20, endDaysAgo: 14 },
        { name: "Week 3", startDaysAgo: 13, endDaysAgo: 7 },
        { name: "Week 4", startDaysAgo: 6, endDaysAgo: 0 },
    ];

    const monthTrajectory = weeks.map((w) => {
        const s = new Date(now.getTime() - w.startDaysAgo * 24 * 60 * 60 * 1000);
        s.setHours(0, 0, 0, 0);
        const e = new Date(now.getTime() - w.endDaysAgo * 24 * 60 * 60 * 1000);
        e.setHours(23, 59, 59, 999);

        const total = recentMonthTransactions
            .filter((tx) => new Date(tx.createdAt) >= s && new Date(tx.createdAt) <= e)
            .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        return {
            day: w.name,
            amount: total,
        };
    });

    const activityItems = [];
    recentTasks.forEach((t) => {
        activityItems.push({
            id: `task_${t._id}`,
            type: "task",
            title: `New task: "${t.title}" posted`,
            meta: t.address?.district || t.category || "General",
            createdAt: t.createdAt,
            color: "emerald",
        });
    });
    recentWorkers.forEach((w) => {
        activityItems.push({
            id: `worker_${w._id}`,
            type: "worker",
            title: `Worker registered: ${w.name}`,
            meta: w.isVerified ? "Verified" : "Pending Verif.",
            createdAt: w.createdAt,
            color: "blue",
        });
    });
    recentPayouts.forEach((p) => {
        activityItems.push({
            id: `payout_${p._id}`,
            type: "payout",
            title: `Payment released to ${p.receiverId?.name || "Worker"}`,
            meta: `₹${Number(p.amount || 0).toLocaleString("en-IN")}`,
            createdAt: p.createdAt,
            color: "teal",
        });
    });
    recentVerifUsers.forEach((v) => {
        activityItems.push({
            id: `verif_${v._id}`,
            type: "verification",
            title: `Verification submitted: ${v.name}`,
            meta: "KYC Queue",
            createdAt: v.updatedAt || v.createdAt,
            color: "purple",
        });
    });
    recentAlerts.forEach((a) => {
        if (a.priority === "urgent" || a.type === "flagged") {
            activityItems.push({
                id: `alert_${a._id}`,
                type: "flag",
                title: a.title,
                meta: "System Monitor",
                createdAt: a.createdAt,
                color: "coral",
            });
        }
    });

    activityItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const liveActivity = activityItems.slice(0, 5);

    return {
        success: true,
        stats: {
            totalUsers: totalUsers || 0,
            activeTasks: activeTasks || 0,
            revenueToday: revenueTodayAmount || 0,
            verifications: pendingVerifications || 0,
        },
        revenueOverview: {
            thisMonth: revenueMonthAmount || 0,
            today: revenueTodayAmount || 0,
            successRate: successRate || 0,
            weekTrajectory,
            monthTrajectory,
        },
        recentSignups: recentSignups.map((u) => ({
            _id: u._id,
            name: u.name,
            role: (u.activeRole || "worker").toUpperCase(),
            createdAt: u.createdAt,
        })),
        liveActivity,
        platformHealth: {
            onlineWorkers: onlineWorkersCount || 0,
            tasksToday: tasksTodayCount || 0,
            bidsToday: bidsTodayCount || 0,
            avgBidsPerTask: avgBidsPerTask || "0",
        },
    };
};

