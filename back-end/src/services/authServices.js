import crypto from "crypto";
import otpTemplate from "../utils/otpTemplate.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import Otp from "../models/otpSchems.js";
import User from "../models/userSchema.js";
import { hashData, compareHash } from "../utils/hasing.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";

export const googleLoginService = async (accessToken) => {
  // try {
  const googleResponse = await fetch(process.env.GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!googleResponse.ok) {
    return { success: false, message: "Failed to verify Google token" };
  }

  const payload = await googleResponse.json();
  const { email } = payload;

  const existingUser = await User.findOne({ email, activeRole: { $ne: 'admin' } });

  if (!existingUser) {
    return {
      success: false,
      message: "No account found with this Google email. Please sign up first.",
    };
  }

  if (existingUser.isSuspended) {
    return {
      success: false,
      message: "Access Restricted : Your account is suspended by admin",
    };
  }

  const accessTokenJwt = generateAccessToken(existingUser);
  const refreshToken = generateRefreshToken(existingUser);

  existingUser.refreshToken = refreshToken;
  await existingUser.save({ validateBeforeSave: false });

  const { _id, name: userName, email: userEmail, activeRole } = existingUser;
  const responseUser = {
    id: _id,
    name: userName,
    email: userEmail,
    role: activeRole,
    selfie: existingUser?.verificationDocuments?.selfie.url || process.env.USER_ICON,
  };

  return {
    success: true,
    responseUser,
    accessToken: accessTokenJwt,
    refreshToken,
  };
  // } catch (error) {
  //   throw error;
  // }
};


const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 300;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const createOtp = async (email, phone) => {
    const userData = await User.findOne({ $or: [{ email }, { phone }] });
    if (userData) {
      return {
        success: false,
        message: "User already exists with same email or mobile number",
      };
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
    const otpSend = await sendOtp(email, otp);
    if (!otpSend) {
      await Otp.deleteOne({ email });
      return { success: false, response: "Failed to send OTP" };
    }
    return {
      success: true,
      message: "OTP sent successfully",
      response: otpRecord,
    };
};

export const sendOtp = async (email, otp) => {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: {
            name: "NEXARO",
            email: process.env.BREVO_USER,
          },
          to: [{ email }],
          subject: "NEXARO Verification Code",
          htmlContent: otpTemplate(otp),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Brevo API Error:", errorData);
        throw new Error(
          `Brevo API rejected the request: ${errorData?.message ?? response.status}`,
        );
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
        console.error(
          `sendOtp error (attempt ${attempt}/${MAX_RETRIES}):`,
          error,
        );
        throw error;
      }

      const delay = RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
      console.warn(
        `sendOtp: transient error on attempt ${attempt}, retrying in ${delay}ms...`,
      );
      await sleep(delay);
    }
  }

  throw lastError;
};

export const verifyOtp = async (email, otp) => {
  console.log(email, otp);
  try {
    const otpRecord = await Otp.findOne({
      email,
      expiresAt: { $gt: new Date() },
    });
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
};

export const loginService = async (userData, isAdmin) => {
  const { email, password } = userData;
    // 1. Find user by email
    if (isAdmin) {
      const existingUser = await User.findOne({ email, activeRole: "admin" });
      if (!existingUser) {
        return { success: false, message: "Invalid admin credentials" };
      }
    }
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return { success: false, message: "User not found" };
    }

    if (existingUser.isSuspended) {
      return { success: false, message: "Access Restricted : Your account is suspended by admin" };
    }

    // 2. Check if the password matches
    const isPasswordValid = await compareHash(password, existingUser.password);
    if (!isPasswordValid) {
      return { success: false, message: "Invalid password" };
    }

    // 3. Generate tokens
    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);

    // 4. refresh token to database
    existingUser.refreshToken = refreshToken;
    await existingUser.save({ validateBeforeSave: false });
    const selfie = existingUser?.verificationDocuments?.selfie.url || process.env.USER_ICON;
    console.log("selfie ", selfie);

    // 5. response user
    const { _id, name, email: userEmail, activeRole } = existingUser;
    const responseUser = {
      id: _id,
      name,
      email: userEmail,
      role: activeRole,
      selfie,
    };

    return {
      success: true,
      message: "Login successful",
      responseUser,
      accessToken,
      refreshToken,
    };
};

export const sendForgotPasswordEmail = async (email, otp) => {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: {
            name: "NEXARO",
            email: process.env.BREVO_USER,
          },
          to: [{ email }],
          subject: "NEXARO Password Reset OTP",
          htmlContent: forgotPasswordTemplate(otp),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Brevo API Error:", errorData);
        throw new Error(
          `Brevo API rejected the request: ${errorData?.message ?? response.status}`,
        );
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
        console.error(
          `sendForgotPasswordEmail error (attempt ${attempt}/${MAX_RETRIES}):`,
          error,
        );
        throw error;
      }

      const delay = RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
      console.warn(
        `sendForgotPasswordEmail: transient error on attempt ${attempt}, retrying in ${delay}ms...`,
      );
      await sleep(delay);
    }
  }

  throw lastError;
};

export const forgotPasswordOtpService = async (email, role) => {
  console.log("role", role);

    if (role === "admin") {
      const userData = await User.findOne({ email, activeRole: role });
      if (!userData) {
        return {
          success: false,
          message: "Invalid admin credentials",
        };
      }
    } else {
      const userData = await User.findOne({
        email,
        activeRole: { $in: ["worker", "poster"] },
      });
      if (!userData) {
        return {
          success: false,
          message: "User does not exist with this email",
        };
      }
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    console.log("Forgot Password OTP", otp);

    const existingOtp = await Otp.findOne({ email });
    if (existingOtp) {
      await Otp.deleteOne({ email });
    }

    const hashedOtp = await hashData(otp);
    await Otp.create({
      email,
      otp: hashedOtp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const otpSend = await sendForgotPasswordEmail(email, otp);
    if (!otpSend) {
      await Otp.deleteOne({ email });
      return { success: false, message: "Failed to send password reset OTP" };
    }

    return { success: true, message: "Password reset OTP sent successfully" };
};

export const updatePasswordService = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "User does not exist with this email" };
    }

    const hashedPassword = await hashData(password);
    user.password = hashedPassword;
    await user.save();

    return { success: true, message: "Password updated successfully" };
};
