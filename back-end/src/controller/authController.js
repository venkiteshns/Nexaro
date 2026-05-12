import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';
import { createOtp, verifyOtp } from '../services/authServices.js';
import { posterSignupService } from '../services/posterServices.js';

export const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ success: false, message: "Refresh token is required" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded._id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
        }

        const newAccessToken = user.generateAccessToken();

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        console.error("Refresh token error:", error.message);
        return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
    }
};

export const getOtpForSignUp = async (req, res) => {
    try {
        let response = await createOtp(req.body.email);
        if (response.success) {
            return res.status(200).json({ success: true, message: "OTP sent successfully" });
        } else {
            return res.status(400).json({ success: false, message: response.message });
        }

    } catch (error) {
        console.error("OTP send error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const verifySignUpOtp = async (req, res) => {
    try {
        let response = await verifyOtp(req.body.email, req.body.otp);
        if (response.success) {
            return res.status(200).json({ success: true, message: "OTP verified successfully" });
        } else {
            return res.status(400).json({ success: false, message: response.message });
        }

    } catch (error) {
        console.error("OTP verify error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const posterSignup = async (req, res) => {
    try {
        const response = await posterSignupService(req.body);

        if (response.error) {
            return res.status(400).json({ success: false, message: response.error });
        }

        const { responseUser, accessToken, refreshToken } = response;

        return res
            .status(201)
            .json({ success: true, message: "Poster registered successfully", user: responseUser, accessToken, refreshToken });
    } catch (error) {
        console.error("Poster signup error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};