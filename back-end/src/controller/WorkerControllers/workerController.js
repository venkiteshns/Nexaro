import STATUS_CODES from "../../constants/statusCodes.js";
import MESSAGES from "../../constants/messages.js";
import {
  workerSignupService,
  getWorkerProfileService,
  updateWorkerProfileService,
  switchRoleToPosterService,
  getAllReviewService,
  getEarningHeroDataService,
  getTransactionHistoryService,
  getWorkerEarningsChartService,
  withdrawWorkerEarningsService,
  getWorkerNotificationsService,
  markAllWorkerNotificationsReadService,
  markWorkerNotificationReadService,
  getWorkerUnreadCountService,
  getWorkerHeaderStatusService,
  toggleWorkerLiveStatusService,
  getWorkerDashboardService
} from "../../services/workerServices.js";
import { getTaskForBidService, getWorkerBidsService, getNearbyTasksService, getWorkerBidDetailsService, withdrawBidService, getWorkerActiveJobService, getWorkerCurrentActiveJobService, updateJobProgressService, getCompletedTaskWorkerSideService } from "../../services/taskServices.js";
import logger from "../../utils/logger.js";


export const workerSignup = async (req, res) => {

    try {

        const result = await workerSignupService({ data: req.body, files: req.files });

        if (result?.error) {
            throw new Error(result.error);
        }

        return res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: MESSAGES.WORKER_REGISTERED,
            user: result.responseUser,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });

    } catch (error) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: error.message,
        });
    }
};

export const getNearbyTasks = async (req, res) => {
    try {
        const workerId = req.user._id;

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 9);

        const result = await getNearbyTasksService(workerId, {
            search: req.query.search || "",
            category: req.query.category || "",
            page,
            limit,
        });

        if (result.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: result.error,
            });
        }

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.NEARBY_TASKS_FETCHED,
            tasks: result.tasks,
            categoryList: result.categoryList,
            pagination: result.pagination,
        });

    } catch (error) {
        logger.error("getNearbyTasks controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getTaskForBid = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const workerId = req.user?._id;
        const result = await getTaskForBidService(taskId, workerId);
        if (result.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: result.error,
            });
        }

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.TASK_FETCHED,
            task: result,
        });
    } catch (error) {
        logger.error("getTaskForBid controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
}

export const getWorkerBids = async (req, res) => {
    try {
        const workerId = req.user._id;

        const status = req.query.status || "all";
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 5);

        const result = await getWorkerBidsService(workerId, { status, page, limit });

        if (result.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: result.error,
            });
        }

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "Bids fetched successfully",
            bids: result.bids,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            },
            counts: result.counts,
        });
    } catch (error) {
        logger.error("getWorkerBids controller error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
}

export const getWorkerBidDetails = async (req, res) => {
    try {
        const { bidId } = req.params;
        const workerId = req.user._id;

        const result = await getWorkerBidDetailsService(bidId, workerId);

        if (result.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: result.error,
            });
        }

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "Bid details fetched successfully",
            bid: result.bid,
            task: result.task,
            poster: result.poster,
            competition: result.competition,
        });

    } catch (error) {
        logger.error("getWorkerBidDetails controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
}

export const withdrawBid = async (req, res) => {
    try {
        const result = await withdrawBidService(req.params.bidId)
        if (result.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: result.error
            })
        }
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: result.message,
        })
    } catch (error) {
        logger.error("withdrawBid controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }

}

export const getWorkerActiveJob = async (req, res) => {
    try {
        const workerId = req.user._id;
        const { taskId } = req.params;
        const result = await getWorkerActiveJobService(taskId, workerId);
        if (result.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: result.error });
        }
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "Active job fetched successfully",
            data: result,
        });
    } catch (error) {
        logger.error("getWorkerActiveJob controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const updateJobProgress = async (req, res) => {
    try {
        const workerId = req.user._id;
        const { taskId } = req.params;
        const { update } = req.body;
        const result = await updateJobProgressService(taskId, workerId, update);
        if (result.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: result.error });
        }
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: result.message,
            update: result.update,
        });
    } catch (error) {
        logger.error("updateJobProgress controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const getWorkerCurrentActiveJob = async (req, res) => {
    try {
        const workerId = req.user._id;
        const result = await getWorkerCurrentActiveJobService(workerId);
        if (result.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: result.error });
        }
        return res.status(STATUS_CODES.OK).json({
            success: true,
            taskFound: result.taskFound,
            taskId: result.taskId ?? null,
            title: result.title ?? null,
        });
    } catch (error) {
        logger.error("getWorkerCurrentActiveJob controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const getWorkerProfile = async (req, res) => {
    const response = await getWorkerProfileService(req.user)
    if (response.error) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: response.error || MESSAGES.UNEXPECTED_ERROR })
    }
    return res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.PROFILE_FETCH_SUCCESS, profileData: response.profileData })
}

export const updateWorkerProfile = async (req, res) => {
    const response = await updateWorkerProfileService({ user: req.user, data: req.body, avatar: req.files })
    if (response.unauthorized) {
        return res.status(STATUS_CODES.FORBIDDEN).json({ success: false, message: response.unauthorized })
    }
    if (response.error) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: response.error })
    }

    return res.status(STATUS_CODES.OK).json({ success: true, message: response.message })

}

export const switchRoleToPoster = async (req, res) => {
    const response = await switchRoleToPosterService({ user: req.user });
    if (response.forbidden) {
        return res.status(STATUS_CODES.FORBIDDEN).json({ success: false, message: response.forbidden });
    }

    if (response.error) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: response.error });
    }

    return res.status(STATUS_CODES.OK).json({ success: true, message: response.message, accessToken: response.accessToken, user: response.user });
}

export const getAllReviews = async (req, res) => {
    const response = await getAllReviewService({ user: req.user, query: req.query })
    if (response.forbidden) {
        return res.status(STATUS_CODES.FORBIDDEN).json({ success: false, message: response.forbidden });
    }

    if (response.error) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: response.error });
    }

    return res.status(STATUS_CODES.OK).json({ success: true, data: response.reviews, message: response.message })
}

export const getCompletedTaskWorkerSide = async (req, res) => {
    const { taskId } = req.params;
    const workerId = req.user._id || req.user.id;

    const response = await getCompletedTaskWorkerSideService(taskId, workerId);

    if (response.error) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ success: false, message: response.error });
    }

    return res.status(STATUS_CODES.OK).json({ success: true, data: response.data });
};

export const getEarningHeroData = async (req, res) => {
    try {
        const result = await getEarningHeroDataService({ userId: req.user._id });
        if (result.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: result.error,
            });
        }
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: result.message,
            earningsData: result.earningsData,
        });
    } catch (error) {
        logger.error("getEarningHeroData controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getTransactionHistory = async (req, res) => {
    const response = await getTransactionHistoryService({ userId: req.user._id, page: req.query.page, limit: req.query.limit });
    if (response.error) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: response.error,
        });
    }
    return res.status(STATUS_CODES.OK).json({
        success: true,
        message: response.message,
        transactionsData: response.transactionsData,
        pagination: response.pagination,
    });
}

export const getWorkerEarningsChart = async (req, res) => {
    try {
        const response = await getWorkerEarningsChartService({
            userId: req.user._id,
            timeframe: req.query.timeframe,
        });

        if (response.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: response.error,
            });
        }

        return res.status(STATUS_CODES.OK).json({
            success: true,
            timeframe: response.timeframe,
            totalEarnings: response.totalEarnings,
            chartData: response.chartData,
        });
    } catch (error) {
        logger.error("getWorkerEarningsChart error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const withdrawWorkerEarnings = async (req, res) => {
    try {
        const response = await withdrawWorkerEarningsService({
            userId: req.user._id,
            amount: req.body?.amount,
        });

        if (response.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: response.error,
            });
        }

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: response.message,
            withdrawnAmount: response.withdrawnAmount,
            wallet: response.wallet,
            transaction: response.transaction,
        });
    } catch (error) {
        logger.error("withdrawWorkerEarnings error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getWorkerNotifications = async (req, res) => {
    try {
        const workerId = req.user._id;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 6);
        const filter = req.query.filter || "all";

        const result = await getWorkerNotificationsService(workerId, { page, limit, filter });
        return res.status(STATUS_CODES.OK).json(result);
    } catch (error) {
        logger.error("getWorkerNotifications error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const markAllWorkerNotificationsRead = async (req, res) => {
    try {
        const workerId = req.user._id;
        const result = await markAllWorkerNotificationsReadService(workerId);
        return res.status(STATUS_CODES.OK).json(result);
    } catch (error) {
        logger.error("markAllWorkerNotificationsRead error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const markWorkerNotificationRead = async (req, res) => {
    try {
        const workerId = req.user._id;
        const { id } = req.params;
        const result = await markWorkerNotificationReadService(workerId, id);
        if (result.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: result.error });
        }
        return res.status(STATUS_CODES.OK).json(result);
    } catch (error) {
        logger.error("markWorkerNotificationRead error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getWorkerUnreadCount = async (req, res) => {
    try {
        const workerId = req.user._id;
        const result = await getWorkerUnreadCountService(workerId);
        return res.status(STATUS_CODES.OK).json(result);
    } catch (error) {
        logger.error("getWorkerUnreadCount error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getWorkerHeaderStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const result = await getWorkerHeaderStatusService(userId);
        if (result.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: result.error,
            });
        }
        return res.status(STATUS_CODES.OK).json({
            success: true,
            ...result,
        });
    } catch (error) {
        logger.error("getWorkerHeaderStatus error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const toggleWorkerLiveStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const { isLive } = req.body;
        const result = await toggleWorkerLiveStatusService(userId, isLive);
        if (result.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: result.error,
            });
        }
        return res.status(STATUS_CODES.OK).json({
            success: true,
            ...result,
        });
    } catch (error) {
        logger.error("toggleWorkerLiveStatus error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getWorkerDashboard = async (req, res) => {
    try {
        const userId = req.user._id;
        const category = req.query.category || "";
        const result = await getWorkerDashboardService({ userId, category });
        if (result?.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: result.error,
            });
        }
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.WORKER_DASHBOARD_FETCHED,
            data: result,
        });
    } catch (error) {
        logger.error("getWorkerDashboard controller error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};


