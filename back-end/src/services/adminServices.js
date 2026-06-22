import mongoose from "mongoose";
import User from "../models/userSchema.js";
import Task from "../models/taskSchema.js";
import MESSAGES from "../constants/messages.js";

export const getAllUsersService = async (page, limit) => {
    const skip = (page - 1) * limit;

        const users = await User.find({ activeRole: { $ne: "admin" } })
            .select("name email phone activeRole isVerified isSuspended createdAt skills location verificationDocuments")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

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
