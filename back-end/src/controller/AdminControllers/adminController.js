import { getAllUsersService, suspendUserService, unsuspendUserService, getPendingVerificationUsersService, approveUserService, rejectUserService, getAllTasksService, cancelTaskByAdminService } from "../../services/adminServices.js";
import STATUS_CODES from "../../constants/statusCodes.js";
import MESSAGES from "../../constants/messages.js";

export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1 || limit < 1) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: MESSAGES.INVALID_PAGE_OR_LIMIT });
        }

        const response = await getAllUsersService(page, limit);

        if (response.success) {
            return res.status(STATUS_CODES.OK).json({
                success: true,
                users: response.users,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalUsers: response.totalUsers,
            });
        } else {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: MESSAGES.FAILED_TO_FETCH_USERS });
        }

    } catch (error) {
        console.error("Get all users error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const suspendUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: MESSAGES.USER_ID_REQUIRED });
        }

        const response = await suspendUserService(userId);
        if (response.success) {
            return res.status(STATUS_CODES.OK).json({ success: true, message: response.message });
        } else {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: response.message });
        }
    } catch (error) {
        console.error("Suspend user error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const unsuspendUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: MESSAGES.USER_ID_REQUIRED });
        }

        const response = await unsuspendUserService(userId);
        if (response.success) {
            return res.status(STATUS_CODES.OK).json({ success: true, message: response.message });
        } else {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: response.message });
        }
    } catch (error) {
        console.error("Unsuspend user error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const getPendingVerificationUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1 || limit < 1) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: MESSAGES.INVALID_PAGE_OR_LIMIT });
        }

        const response = await getPendingVerificationUsersService(page, limit);

        if (response.success) {
            return res.status(STATUS_CODES.OK).json({
                success: true,
                users: response.users,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalUsers: response.totalUsers,
            });
        } else {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: MESSAGES.FAILED_TO_FETCH_USERS });
        }

    } catch (error) {
        console.error("Get pending verification users error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const approveUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: MESSAGES.USER_ID_REQUIRED });
        }

        const response = await approveUserService(userId);
        if (response.success) {
            return res.status(STATUS_CODES.OK).json({ success: true, message: response.message });
        } else {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: response.message });
        }
    } catch (error) {
        console.error("Approve user error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const rejectUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: MESSAGES.USER_ID_REQUIRED });
        }

        const response = await rejectUserService(userId);
        if (response.success) {
            return res.status(STATUS_CODES.OK).json({ success: true, message: response.message });
        } else {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: response.message });
        }
    } catch (error) {
        console.error("Reject user error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const getAllTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        console.log(req.query.limit);

        const response = await getAllTasksService(page, limit);

        if (response.success) {
            return res.status(STATUS_CODES.OK).json({
                success: true,
                tasks: response.tasks,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalTasks: response.totalTasks,
            });
        } else {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: MESSAGES.FAILED_TO_FETCH_TASKS });
        }
    } catch (error) {
        console.error("Get all tasks error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const cancelTaskByAdmin = async (req, res) => {
    try {
        const { taskId } = req.params;
        if (!taskId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: MESSAGES.TASK_ID_REQUIRED });
        }

        const response = await cancelTaskByAdminService(taskId);
        if (response.success) {
            return res.status(STATUS_CODES.OK).json({ success: true, message: response.message });
        } else {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: response.message });
        }
    } catch (error) {
        console.error("Cancel task by admin error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};