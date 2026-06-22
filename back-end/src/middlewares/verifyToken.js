import jwt from "jsonwebtoken";
import STATUS_CODES from "../constants/statusCodes.js";
import MESSAGES from "../constants/messages.js";

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.REFRESH_TOKEN_REQUIRED,
            });
        }

        const accessToken = authHeader.split(" ")[1];

        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        req.user = decoded;
        return next();

    } catch (error) {
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.INVALID_REFRESH_TOKEN,
            });
        }

        console.error("Token verification error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export default verifyToken;
