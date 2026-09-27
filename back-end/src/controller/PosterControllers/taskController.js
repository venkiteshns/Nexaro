import { getTasksService } from "../../services/posterServices.js";
import { createTaskService, handleNewBid, cancelTaskByPosterService, updateTaskService } from "../../services/taskServices.js";
import STATUS_CODES from "../../constants/statusCodes.js";
import MESSAGES from "../../constants/messages.js";
import logger from "../../utils/logger.js";

export const createTask = async (req, res) => {
    try {
        const posterId = req.user._id;

        const response = await createTaskService(req.body, req.files, posterId);

        if (response.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: response.error,
            });
        }

        return res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: MESSAGES.TASK_CREATED,
            task: response.task,
        });

    } catch (error) {
        logger.error("createTask controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getMyTasks = async (req, res) => {
    try {
        const posterId = req.user._id;

        const tasks = await getTasksService(posterId, req.query);

        if (tasks.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: tasks.error,
            });
        }

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.TASKS_FETCHED,
            tasks,
        });

    } catch (error) {
        logger.error("getMyTasks controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const addNewBid = async (req, res) => {

    try {
        const response = await handleNewBid(req.body, req.user)
        if (response.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: response.error,
            });
        }
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: response,
        });
    } catch (error) {
        logger.error("addnewbid controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
}

export const cancelTaskByPoster = async (req, res) => {
    try {
        const response = await cancelTaskByPosterService(req.params.taskId);

        if (response.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: response.error,
            });
        }
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: res.message,
        });
    } catch (error) {
        logger.error("cancelTaskByPoster controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
}

export const updateTask = async (req, res) => {
    try {
        const posterId = req.user._id;
        const { taskId } = req.params;

        const response = await updateTaskService(taskId, posterId, req.body, req.files);

        if (response.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: response.error,
            });
        }

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "Task updated successfully",
            task: response.task,
        });
    } catch (error) {
        logger.error("updateTask controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
