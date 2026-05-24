import User from "../models/userSchema.js";

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
            return { success: false, message: "User not found" };
        }

        if (user.isSuspended) {
            return { success: false, message: "User is already suspended" };
        }

        user.isSuspended = true;
        await user.save({ validateBeforeSave: false });

        return { success: true, message: "User suspended successfully" };
    } catch (error) {
        throw error;
    }
};

export const unsuspendUserService = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, message: "User not found" };
        }

        if (!user.isSuspended) {
            return { success: false, message: "User is not suspended" };
        }

        user.isSuspended = false;
        await user.save({ validateBeforeSave: false });

        return { success: true, message: "User unsuspended successfully" };
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
            return { success: false, message: "User not found" };
        }

        if (user.isVerified) {
            return { success: false, message: "User is already verified" };
        }

        user.isVerified = true;
        await user.save({ validateBeforeSave: false });

        return { success: true, message: "User approved successfully" };
    } catch (error) {
        throw error;
    }
};

export const rejectUserService = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, message: "User not found" };
        }

        user.isSuspended = true;
        await user.save({ validateBeforeSave: false });

        return { success: true, message: "User rejected and account suspended" };
    } catch (error) {
        throw error;
    }
};
