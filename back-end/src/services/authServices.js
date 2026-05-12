import crypto from "crypto";
import nodemailer from "nodemailer";
import otpTemplate from "../utils/otpTemplate.js";
import Otp from "../models/otpSchems.js";
import user from "../models/userSchema.js";
import { hashData, compareHash } from "../utils/hasing.js";

export const createOtp = async (email, phone) => {
    try {
        const userData = await user.findOne({ $or: [{ email }, { phone }] });
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
        console.log(email);
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
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "api-key": process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                sender: {
                    name: "NEXARO",
                    email: process.env.BREVO_USER
                },
                to: [{ email: email }],
                subject: "NEXARO Verification Code",
                htmlContent: otpTemplate(otp)
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Brevo API Error:", errorData);
            throw new Error("Failed to send email via Brevo API");
        }

        return true;
    } catch (error) {
        console.error("sendOtp error:", error);
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
