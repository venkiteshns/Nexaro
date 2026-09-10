import {
    getAllUsersService,
    suspendUserService,
    unsuspendUserService,
    getPendingVerificationUsersService,
    approveUserService,
    rejectUserService,
    getAllTasksService,
    cancelTaskByAdminService,
    getAdminTaskDetailsService,
    getAdminFinanceStatsService,
    getAdminFinanceChartService,
    getAdminFinanceTransactionsService,
    getAdminDailyRevenueReportService,
    getAdminMonthlyPlReportService,
    getAdminPlatformFeeSummaryService,
    getAdminNotificationsService,
    markAllNotificationsReadService,
    markNotificationReadService,
    sendAnnouncementService,
    getRecentAnnouncementsService,
    getAdminDashboardService,
} from "../../services/adminServices.js";
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

export const getAdminFinanceStats = async (req, res) => {
    try {
        const range = req.query.range || "Last 30 Days";
        const response = await getAdminFinanceStatsService(range);
        return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
        console.error("Get admin finance stats error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const getAdminFinanceChart = async (req, res) => {
    try {
        const timeframe = req.query.timeframe || "7D";
        const metric = req.query.metric || "revenue";
        const response = await getAdminFinanceChartService(timeframe, metric);
        return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
        console.error("Get admin finance chart error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const getAdminFinanceTransactions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search?.trim() || "";
        const status = req.query.status || "ALL";
        const range = req.query.range || "All Time";

        const response = await getAdminFinanceTransactionsService({
            page,
            limit,
            search,
            status,
            range,
        });

        return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
        console.error("Get admin finance transactions error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const getAdminDailyRevenueReport = async (req, res) => {
    try {
        const response = await getAdminDailyRevenueReportService();
        return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
        console.error("Get admin daily revenue report error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const getAdminMonthlyPlReport = async (req, res) => {
    try {
        const { year, month } = req.query;
        const response = await getAdminMonthlyPlReportService(year, month);
        return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
        console.error("Get admin monthly P&L report error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const getAdminPlatformFeeSummary = async (req, res) => {
    try {
        const response = await getAdminPlatformFeeSummaryService();
        return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
        console.error("Get admin platform fee summary error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const getAdminNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const filter = req.query.filter || "all";

        const response = await getAdminNotificationsService(page, limit, filter);
        return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
        console.error("Get admin notifications error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const markAllAdminNotificationsRead = async (req, res) => {
    try {
        const response = await markAllNotificationsReadService();
        return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
        console.error("Mark all notifications read error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const markAdminNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await markNotificationReadService(id);
        if (!response.success) {
            return res.status(STATUS_CODES.NOT_FOUND).json(response);
        }
        return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
        console.error("Mark notification read error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const sendAdminAnnouncement = async (req, res) => {
    try {
        const { targetAudience, title, message } = req.body;
        if (!title || !message) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "Title and message are required",
            });
        }

        const adminId = req.user?._id;
        const response = await sendAnnouncementService({
            targetAudience,
            title,
            message,
            adminId,
        });

        return res.status(STATUS_CODES.CREATED).json(response);
    } catch (error) {
        console.error("Send admin announcement error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getAdminRecentAnnouncements = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const response = await getRecentAnnouncementsService(limit);
        return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
        console.error("Get recent announcements error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getAdminDashboard = async (req, res) => {
    try {
        const response = await getAdminDashboardService();
        return res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
        console.error("Get admin dashboard error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};