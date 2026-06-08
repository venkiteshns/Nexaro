import { workerSignupService, getNearbyTasksService } from "../../services/workerServices.js";
import STATUS_CODES from "../../constants/statusCodes.js";
import MESSAGES from "../../constants/messages.js";

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

        const result = await getNearbyTasksService(workerId);

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
        });

    } catch (error) {
        console.error("getNearbyTasks controller error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
