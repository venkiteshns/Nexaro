import crypto from "crypto";
import nodemailer from "nodemailer";
import otpTemplate from "../utils/otpTemplate.js";
import Otp from "../models/otpSchems.js";
import user from "../models/userSchema.js";

export const createOtp = async (email) => {
    try {
        const userData = await user.findOne({ email });
        if (userData) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const otp = crypto.randomInt(100000, 999999).toString();
        console.log("OTP", otp);
        const otpRecord = await Otp.create({
            email,
            otp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });
        let otpSend = await sendOtp(email, otp);
        if (!otpSend) {
            await Otp.deleteOne({ email });
            return { success: false, response: "Failed to send OTP" };
        }
        return { success: true, message: "OTP sent successfully", response: otpRecord };

    } catch (error) {
        throw error;
    }
}

export const sendOtp = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "NEXARO Verification Code",
            html: otpTemplate(otp),
        });
        return true;
    } catch (error) {
        throw error;
    }
}