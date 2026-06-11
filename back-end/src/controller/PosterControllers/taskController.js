import { getTasksService } from "../../services/posterServices.js";
import { createTaskService, handleNewBid } from "../../services/taskServices.js";
import STATUS_CODES from "../../constants/statusCodes.js";
import MESSAGES from "../../constants/messages.js";

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
        console.error("createTask controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getMyTasks = async (req, res) => {
    try {
        const posterId = req.user._id;

        const tasks = await getTasksService(posterId);

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
        console.error("getMyTasks controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const addNewBid = async(req,res) => {
    try {
        let response = await handleNewBid(req.body)
    } catch (error) {
        
    }
}