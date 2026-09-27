import STATUS_CODES from "../../constants/statusCodes.js";
import MESSAGES from "../../constants/messages.js";
import {
  getPosterPaymentOverviewService,
  getPosterPaymentHistoryService,
  getPosterSpendingChartService,
} from "../../services/posterPaymentServices.js";
import logger from "../../utils/logger.js";

export const getPosterPaymentOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await getPosterPaymentOverviewService({ userId });

    if (result.error) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(STATUS_CODES.OK).json({
      success: true,
      data: result.stats,
    });
  } catch (error) {
    logger.error("getPosterPaymentOverview error:", error.message);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getPosterPaymentHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 5, search = "", status = "all" } = req.query;

    const result = await getPosterPaymentHistoryService({
      userId,
      page,
      limit,
      search,
      status,
    });

    if (result.error) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(STATUS_CODES.OK).json({
      success: true,
      transactions: result.transactions,
      pagination: result.pagination,
    });
  } catch (error) {
    logger.error("getPosterPaymentHistory error:", error.message);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getPosterSpendingChart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { timeframe = "30D" } = req.query;

    const result = await getPosterSpendingChartService({
      userId,
      timeframe,
    });

    if (result.error) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(STATUS_CODES.OK).json({
      success: true,
      timeframe: result.timeframe,
      totalSpent: result.totalSpent,
      chartData: result.chartData,
    });
  } catch (error) {
    logger.error("getPosterSpendingChart error:", error.message);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};
