import { getAllUsersService } from "../../services/adminServices.js";

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
