import { workerSignupService } from "../../services/workerServices.js";

export const workerSignup = async (req, res) => {
    try {

        const result = await workerSignupService({ data: req.body, files: req.files });
        if (result?.error) {
            throw new Error(result.error)
        }

        return res.status(201).json({
            success: true,
            message: "Worker registered successfully",
            user: result.responseUser,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        });

    } catch (error) {
        return res.status(400).json({ success: false, message: result.error });
    }

};