import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';

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
