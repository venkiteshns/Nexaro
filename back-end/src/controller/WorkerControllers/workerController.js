import { workerSignupService } from "../../services/workerServices.js";
import STATUS_CODES from "../../constants/statusCodes.js";
import MESSAGES from "../../constants/messages.js";
import { getTaskForBidService, getWorkerBidsService, getNearbyTasksService, getWorkerBidDetailsService, withdrawBidService } from "../../services/taskServices.js";

export const workerSignup = async (req, res) => {
    console.log(req.body, "body", req.files, "files");

    try {

        const result = await workerSignupService({ data: req.body, files: req.files });

        console.log("result from worker controller", result);

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
        console.error("getNearbyTasks controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getTaskForBid = async (req, res) => {
    // console.log(req.params, "params");
    try {
        const taskId = req.params.taskId;
        const result = await getTaskForBidService(taskId);
        if (result.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: result.error,
            });
        }
        console.log("task data", result);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.TASK_FETCHED,
            task: result,
        });
    } catch (error) {
        console.error("getTaskForBid controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
}

export const getWorkerBids = async (req, res) => {
    try {
        const workerId = req.user._id;

        const status = req.query.status || "all";       // "all" | "pending" | "accepted" | "rejected"
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
        console.error("getWorkerBids controller error:", error);
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
        console.error("getWorkerBidDetails controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
}

export const withdrawBid = async (req, res) => {
    // console.log("bidId from controller ", req.params.bidId);
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
        console.error("withdrawBid controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }

}
