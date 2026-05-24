import { getAllUsersService, suspendUserService, unsuspendUserService, getPendingVerificationUsersService, approveUserService, rejectUserService } from "../../services/adminServices.js";

export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1 || limit < 1) {
            return res.status(400).json({ success: false, message: "Invalid page or limit value" });
        }

        const response = await getAllUsersService(page, limit);

        if (response.success) {
            return res.status(200).json({
                success: true,
                users: response.users,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalUsers: response.totalUsers,
            });
        } else {
            return res.status(400).json({ success: false, message: "Failed to fetch users" });
        }

    } catch (error) {
        console.error("Get all users error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const suspendUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const response = await suspendUserService(userId);
        if (response.success) {
            return res.status(200).json({ success: true, message: response.message });
        } else {
            return res.status(400).json({ success: false, message: response.message });
        }
    } catch (error) {
        console.error("Suspend user error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const unsuspendUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const response = await unsuspendUserService(userId);
        if (response.success) {
            return res.status(200).json({ success: true, message: response.message });
        } else {
            return res.status(400).json({ success: false, message: response.message });
        }
    } catch (error) {
        console.error("Unsuspend user error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getPendingVerificationUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1 || limit < 1) {
            return res.status(400).json({ success: false, message: "Invalid page or limit value" });
        }

        const response = await getPendingVerificationUsersService(page, limit);

        if (response.success) {
            return res.status(200).json({
                success: true,
                users: response.users,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalUsers: response.totalUsers,
            });
        } else {
            return res.status(400).json({ success: false, message: "Failed to fetch users" });
        }

    } catch (error) {
        console.error("Get pending verification users error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const approveUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const response = await approveUserService(userId);
        if (response.success) {
            return res.status(200).json({ success: true, message: response.message });
        } else {
            return res.status(400).json({ success: false, message: response.message });
        }
    } catch (error) {
        console.error("Approve user error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const rejectUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const response = await rejectUserService(userId);
        if (response.success) {
            return res.status(200).json({ success: true, message: response.message });
        } else {
            return res.status(400).json({ success: false, message: response.message });
        }
    } catch (error) {
        console.error("Reject user error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
