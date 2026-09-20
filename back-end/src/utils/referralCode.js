import crypto from "crypto";
import User from "../models/userSchema.js";

/**
 * Generates a collision-safe, unique referral code for a new user.
 * Format: NEX + 8 hexadecimal uppercase characters (e.g. NEX9F2A19E2)
 * 4 bytes = 4.29 billion combinations.
 */
export const generateUniqueReferralCode = async () => {
  let isUnique = false;
  let code = "";

  while (!isUnique) {
    code = "NEX" + crypto.randomBytes(4).toString("hex").toUpperCase();
    const existing = await User.exists({ referralCode: code });
    if (!existing) {
      isUnique = true;
    }
  }

  return code;
};
