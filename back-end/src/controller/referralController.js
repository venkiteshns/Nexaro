import STATUS_CODES from "../constants/statusCodes.js";
import {
  getUserReferralStatsService,
  validateReferralCodeService,
} from "../services/referralService.js";

/**
 * Controller to get authenticated user's referral code, stats, and invited friends.
 */
export const getReferralStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const response = await getUserReferralStatsService(userId);

    if (!response.success) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: response.message,
      });
    }

    return res.status(STATUS_CODES.OK).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("getReferralStats controller error:", error.message);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch referral statistics",
    });
  }
};

/**
 * Controller to validate a referral code (used on blur in registration form).
 */
export const validateReferralCode = async (req, res) => {
  try {
    const { code } = req.params;
    const currentUserId = req.user?._id || null;

    const response = await validateReferralCodeService(code, currentUserId);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      valid: response.valid,
      referrerName: response.referrerName,
      message: response.message,
      code: response.code,
    });
  } catch (error) {
    console.error("validateReferralCode controller error:", error.message);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      valid: false,
      message: "Failed to validate referral code",
    });
  }
};
