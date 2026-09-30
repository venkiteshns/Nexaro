import STATUS_CODES from "../constants/statusCodes.js";
import logger from "../utils/logger.js";

const errorHandler = (err, req, res, _next) => {
    logger.error(`${req.method} ${req.originalUrl}`, { message: err.message, stack: err.stack });

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: 'Validation failed',
            errors: messages,
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        return res.status(409).json({
            success: false,
            message: `Duplicate value: ${field} already exists`,
        });
    }

    if (err.name === 'CastError') {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: `Invalid value for field: ${err.path}`,
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            success: false,
            message: 'Invalid token. Please log in again.',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            success: false,
            message: 'Token expired. Please log in again.',
        });
    }

    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: 'File too large. Maximum file size is 10 MB per file.',
            });
        }
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: `File upload error: ${err.message}`,
        });
    }

    if (err.message && err.message.includes('Invalid file format')) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: err.message,
        });
    }

    const statusCode = err.statusCode || err.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};

export default errorHandler;
