import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';
import { createOtp, loginService, verifyOtp, forgotPasswordOtpService, updatePasswordService, googleLoginService } from '../services/authServices.js';
import { generateAccessToken } from '../utils/generateTokens.js';
import STATUS_CODES from '../constants/statusCodes.js';
import MESSAGES from '../constants/messages.js';

export const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({ success: false, message: MESSAGES.REFRESH_TOKEN_REQUIRED });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded._id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(STATUS_CODES.FORBIDDEN).json({ success: false, message: MESSAGES.INVALID_REFRESH_TOKEN });
        }

        const newAccessToken = generateAccessToken(user);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        console.error("Refresh token error:", error.message);
        return res.status(STATUS_CODES.FORBIDDEN).json({ success: false, message: MESSAGES.INVALID_REFRESH_TOKEN });
    }
};

export const getOtpForSignUp = async (req, res) => {
    try {
        const response = await createOtp(req.body.email, req.body.phone);
        if (response.success) {
            return res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.OTP_SENT });
        } else {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: response.message });
        }

    } catch (error) {
        console.error("OTP send error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const verifySignUpOtp = async (req, res) => {
    try {
        const response = await verifyOtp(req.body.email, req.body.otp);
        if (response.success) {
            return res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.OTP_VERIFIED });
        } else {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: response.message });
        }

    } catch (error) {
        console.error("OTP verify error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const login = async (req, res) => {
    try {
        const response = await loginService(req.body, req.params?.admin);
        if (response.success) {
            const { responseUser, accessToken, refreshToken } = response;

            return res.status(STATUS_CODES.OK).json({
                success: true,
                message: MESSAGES.LOGIN_SUCCESS,
                user: responseUser,
                accessToken,
                refreshToken,
            });
        } else {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: response.message });
        }

    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            await User.findByIdAndUpdate(decoded._id, { refreshToken: '' });
        }
        return res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.LOGGED_OUT });
    } catch {
        return res.status(STATUS_CODES.OK).json({ success: true, message: MESSAGES.LOGGED_OUT });
    }
};

export const forgotPasswordOtp = async (req, res) => {
    console.log("req.body ", req.body);

    try {
        const { email } = req.body;
        if (!email) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: MESSAGES.EMAIL_REQUIRED });
        }

        const response = await forgotPasswordOtpService(email, req.params?.role);

        if (response.success) {
            return res.status(STATUS_CODES.OK).json({ success: true, message: response.message });
        } else {
            const status = response.message === "User does not exist with this email" ? STATUS_CODES.NOT_FOUND : STATUS_CODES.BAD_REQUEST;
            return res.status(status).json({ success: false, message: response.message });
        }
    } catch (error) {
        console.error("Forgot password OTP error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: MESSAGES.EMAIL_AND_PASSWORD_REQUIRED });
        }

        const response = await updatePasswordService(email, password);
        if (response.success) {
            return res.status(STATUS_CODES.OK).json({ success: true, message: response.message });
        } else {
            const status = response.message === "User does not exist with this email" ? STATUS_CODES.NOT_FOUND : STATUS_CODES.BAD_REQUEST;
            return res.status(status).json({ success: false, message: response.message });
        }
    } catch (error) {
        console.error("Update password error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const googleLogin = async (req, res) => {
    try {
        const { idToken: accessToken } = req.body;

        if (!accessToken) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.GOOGLE_TOKEN_REQUIRED,
            });
        }

        const response = await googleLoginService(accessToken);

        if (response.success) {
            return res.status(STATUS_CODES.OK).json({
                success: true,
                message: MESSAGES.LOGIN_SUCCESS,
                user: response.responseUser,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
            });
        } else {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: response.message,
            });
        }
    } catch (error) {
        console.error("Google login error:", error.message);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};