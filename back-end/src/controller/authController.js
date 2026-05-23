import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';
import { createOtp, loginService, verifyOtp } from '../services/authServices.js';
import { generateAccessToken } from '../utils/generateTokens.js';

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

        const newAccessToken = generateAccessToken(user);

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
        let response = await createOtp(req.body.email, req.body.phone);
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

export const login = async (req, res) => {
    try {
        const response = await loginService(req.body);

        if (response.success) {
            // Destructure everything the service prepared for us
            const { responseUser, accessToken, refreshToken } = response;

            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: responseUser,
                accessToken,
                refreshToken,
            });
        } else {
            return res.status(400).json({ success: false, message: response.message });
        }

    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
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
        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch {
        return res.status(200).json({ success: true, message: 'Logged out' });
    }
};