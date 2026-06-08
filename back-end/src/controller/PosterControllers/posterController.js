import { posterSignupService } from "../../services/posterServices.js";
import STATUS_CODES from "../../constants/statusCodes.js";
import MESSAGES from "../../constants/messages.js";

export const posterSignup = async (req, res) => {
    try {
        const response = await posterSignupService(req.body);

        if (response.error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: response.error,
            });
        }

        const { responseUser, accessToken, refreshToken } = response;

        return res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: MESSAGES.POSTER_REGISTERED,
            user: responseUser,
            accessToken,
            refreshToken,
        });

    } catch (error) {
        console.error("Poster signup error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};