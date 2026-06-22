import { getAllUsersService, suspendUserService, unsuspendUserService, getPendingVerificationUsersService, approveUserService, rejectUserService, getAllTasksService, cancelTaskByAdminService, getAdminTaskDetailsService } from "../../services/adminServices.js";
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
        const search = req.query.search?.trim() || '';
        const status = req.query.status || 'all';
        const category = req.query.category || 'all';

        if (page < 1 || limit < 1) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: MESSAGES.INVALID_PAGE_OR_LIMIT });
        }

        const response = await getAllTasksService(page, limit, search, status, category);

        if (response.success) {
            return res.status(STATUS_CODES.OK).json({
                success: true,
                tasks: response.tasks,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalTasks: response.totalTasks,
                statusCounts: response.statusCounts,
                categories: response.categories,
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

export const getAdminTaskDetails = async (req, res) => {
    try {
        const { taskId } = req.params;
        if (!taskId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: 'Task ID required' });
        }

        const response = await getAdminTaskDetailsService(taskId);

        if (response.error) {
            return res.status(STATUS_CODES.NOT_FOUND).json({ success: false, message: response.error });
        }

        return res.status(STATUS_CODES.OK).json({ success: true, task: response.task });
    } catch (error) {
        console.error('Get admin task details error:', error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};