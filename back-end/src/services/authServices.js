import crypto from "crypto";
import nodemailer from "nodemailer";
import otpTemplate from "../utils/otpTemplate.js";
import Otp from "../models/otpSchems.js";
import user from "../models/userSchema.js";
import { hashData, compareHash } from "../utils/hasing.js";

export const createOtp = async (email) => {
    try {
        const userData = await user.findOne({ email });
        if (userData) {
            return { success: false, message: "User already exists" };
        }
        const otp = crypto.randomInt(100000, 999999).toString();
        console.log("OTP", otp);

        const existingOtp = await Otp.findOne({ email });
        if (existingOtp) {
            await Otp.deleteOne({ email });
        }

        const hashedOtp = await hashData(otp);

        const otpRecord = await Otp.create({
            email,
            otp: hashedOtp,
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

export const verifyOtp = async (email, otp) => {
    console.log(email, otp);
    try {
        const otpRecord = await Otp.findOne({ email, expiresAt: { $gt: new Date() } });
        if (!otpRecord) {
            return { success: false, message: "Invalid or expired OTP" };
        }
        const isOtpValid = await compareHash(otp, otpRecord.otp);
        if (!isOtpValid) {
            return { success: false, message: "Invalid or expired OTP" };
        }
        await Otp.deleteOne({ email });
        return { success: true, message: "OTP verified successfully" };
    } catch (error) {
        console.log(error);
        throw error;
    }
}
