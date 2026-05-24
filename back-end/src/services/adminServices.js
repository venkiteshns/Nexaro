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
