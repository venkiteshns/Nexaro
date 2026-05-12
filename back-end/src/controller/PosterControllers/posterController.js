import { posterSignupService } from "../../services/posterServices.js";

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