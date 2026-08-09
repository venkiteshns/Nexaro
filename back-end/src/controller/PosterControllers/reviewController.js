import { createReviewService } from "../../services/reviewServices.js";
import STATUS_CODES from "../../constants/statusCodes.js";
import MESSAGES from "../../constants/messages.js";

export const createReview = async (req, res) => {
  try {
    const { taskId, reviewee, rating, review } = req.body;
    const reviewerId = req.user._id;

    const response = await createReviewService(
      { taskId, reviewee, rating, review },
      reviewerId,
    );

    if (response.error) {
      if (response.unauthorized) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: response.error,
        });
      }
      if (response.duplicate) {
        return res.status(409).json({
          success: false,
          message: response.error,
        });
      }
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: response.error,
      });
    }

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: MESSAGES.REVIEW_SUBMITTED,
      data: { reviewId: response.review._id },
    });
  } catch (error) {
    console.error("createReview controller error:", error.message);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};
