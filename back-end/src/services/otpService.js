import redisClient from "../config/redisClient.js";
import crypto from "crypto";
import MESSAGES from "../constants/messages.js";
import { compareHash, hashData } from "../utils/hasing.js";
import { sendOtp } from "./authServices.js";

const OTP_PREFIX = "otp:";
const OTP_TTL_MS = 10 * 60 * 1000;

const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
}

export const setOtp = async (identifier) => {
    console.log("setOtp", identifier);

    const otp = generateOtp();
    const hashedOtp = await hashData(otp);

    const key = `${OTP_PREFIX}:${identifier}`;

    const existingOtp = await redisClient.get(key);
    if (existingOtp) {
        await redisClient.del(key);
    }
    console.log("hashedOtp", otp, hashedOtp);

    await redisClient.set(key, hashedOtp, { EX: OTP_TTL_MS });
    const otpSend = await sendOtp(identifier, otp);
    console.log("OTP SEND", otpSend);

    if (!otpSend) {
        await redisClient.del(key);
        return { success: false, message: MESSAGES.FAILED_TO_SEND_OTP };
    }
    return {
        success: true,
        message: MESSAGES.OTP_SENT,
    };
}

export const verifyRedisOtp = async (identifier, otpToVerify) => {
    const key = `${OTP_PREFIX}:${identifier}`;
    const storedOtp = await redisClient.get(key);

    if (!storedOtp) {
        return { success: false, message: MESSAGES.INVALID_OTP };
    }
    const isOtpValid = await compareHash(otpToVerify, storedOtp);

    if (!isOtpValid) {
        return { success: false, message: MESSAGES.INVALID_OTP };
    }

    await redisClient.del(key);
    return { success: true, message: MESSAGES.OTP_VERIFIED };
}