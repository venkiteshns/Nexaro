import crypto from "crypto";
import nodemailer from "nodemailer";
import otpTemplate from "../utils/otpTemplate.js";
import Otp from "../models/otpSchems.js";
import user from "../models/userSchema.js";
import { hashData, compareHash } from "../utils/hasing.js";
import User from "../models/userSchema.js";

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


const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 300;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendOtp = async (email, otp) => {
    let lastError;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
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
                throw new Error(`Brevo API rejected the request: ${errorData?.message ?? response.status}`);
            }

            return true;

        } catch (error) {
            lastError = error;

            const isTransient =
                error.cause?.code === "ERR_SSL_DECRYPTION_FAILED_OR_BAD_RECORD_MAC" ||
                error.cause?.code === "ECONNRESET" ||
                error.cause?.code === "ECONNREFUSED" ||
                error.message === "fetch failed";

            if (!isTransient || attempt === MAX_RETRIES) {
                console.error(`sendOtp error (attempt ${attempt}/${MAX_RETRIES}):`, error);
                throw error;
            }

            const delay = RETRY_BASE_DELAY_MS * (2 ** (attempt - 1));
            console.warn(`sendOtp: transient error on attempt ${attempt}, retrying in ${delay}ms...`);
            await sleep(delay);
        }
    }

    throw lastError;
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

export const loginService = async ({ email, password }) => {
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return { success: false, message: "User not found" };
        }
        const isPasswordValid = await compareHash(password, existingUser.password);
        if (!isPasswordValid) {
            return { success: false, message: "Invalid password" };
        }
        return { success: true, message: "Login successful", user };
    } catch (error) {
        throw error;
    }
}
