import User from "../models/userSchema.js";
import Task from "../models/taskSchema.js";
import MESSAGES from "../constants/messages.js";

export const getAllUsersService = async (page, limit) => {
    try {
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
    } catch (error) {
        throw error;
    }
};

export const suspendUserService = async (userId) => {
    try {
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
    } catch (error) {
        throw error;
    }
};

export const unsuspendUserService = async (userId) => {
    try {
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
    } catch (error) {
        throw error;
    }
};

export const getPendingVerificationUsersService = async (page, limit) => {
    try {
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
    } catch (error) {
        throw error;
    }
};

export const approveUserService = async (userId) => {
    try {
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
    } catch (error) {
        throw error;
    }
};

export const rejectUserService = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, message: MESSAGES.USER_NOT_FOUND };
        }

        user.isSuspended = true;
        await user.save({ validateBeforeSave: false });

        return { success: true, message: MESSAGES.USER_REJECTED };
    } catch (error) {
        throw error;
    }
};

export const getAllTasksService = async (page, limit) => {
    try {
        const skip = (page - 1) * limit;

        const tasks = await Task.find()
            .populate("posterId", "name email")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalTasks = await Task.countDocuments();
        const totalPages = Math.ceil(totalTasks / limit);

        return {
            success: true,
            tasks,
            currentPage: page,
            totalPages,
            totalTasks,
        };
    } catch (error) {
        throw error;
    }
};

export const cancelTaskByAdminService = async (taskId) => {
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return { error: MESSAGES.TASK_NOT_FOUND };
        }

        task.status = "cancelled";
        await task.save({ validateBeforeSave: false });

        return { success: true, message: MESSAGES.TASK_CANCELLED };
    } catch (error) {
        throw error;
    }
}

