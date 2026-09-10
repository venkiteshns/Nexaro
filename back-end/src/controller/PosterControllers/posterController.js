import {
  posterSignupService,
  getPosterBidsService,
  acceptBidService,
  getPosterTaskProgressService,
  updateUserProfileService,
  getCompletedTaskPosterSideService,
  getPosterProfileService,
  switchRoleToWorkerService,
  posterRoleSwitchAlreadyDataUploadedService,
  getPosterNotificationsService,
  markAllPosterNotificationsReadService,
  markPosterNotificationReadService,
  getPosterUnreadCountService
} from "../../services/posterServices.js";
import STATUS_CODES from "../../constants/statusCodes.js";
import MESSAGES from "../../constants/messages.js";

export const posterSignup = async (req, res) => {
  try {
    const response = await posterSignupService(req.body);

    if (response.error) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: response.error,
      });
    }

    const { responseUser, accessToken, refreshToken } = response;

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: MESSAGES.POSTER_REGISTERED,
      user: responseUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Poster signup error:", error.message);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getPosterBids = async (req, res) => {
  try {
    const response = await getPosterBidsService(
      req.params.taskId,
      req.query.sort,
    );
    if (response.error) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: response.error,
      });
    }

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Bids fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error("getPosterBids error:", error.message);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const acceptBid = async (req, res) => {
  try {
    const response = await acceptBidService(req.params.bidId);

    if (response.error) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: response.error,
      });
    }

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Bid accepted successfully",
      data: {
        acceptedBid: response.acceptedBid,
        rejectedCount: response.rejectedCount,
        task: response.task,
      },
    });
  } catch (error) {
    console.error("acceptBid error:", error.message);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getPosterTaskProgress = async (req, res) => {
  try {
    const response = await getPosterTaskProgressService(req.params.taskId);
    if (response.error) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: response.error,
      });
    }
    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Task progress fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error("getPosterTaskProgress controller error:", error.message);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  const response = await updateUserProfileService({
    userId: req.user._id,
    body: req.body,
    avatar: req.files?.avatar,
  });
  if (response.error) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ success: false, message: response.error });
  }
  return res.status(STATUS_CODES.CREATED).json({
    success: true,
    message: response.message,
  });
};

export const getCompletedTaskPosterSide = async (req, res) => {
  // console.log("task id : ", req.params.taskId);
  // console.log("user id", req.user._id);
  const response = await getCompletedTaskPosterSideService(
    req.params.taskId,
    req.user._id,
  );
  // console.log('resssssssssssssss', response);

  if (response.error) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: response.error,
    });
  }
  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "Task completed details fetched successfully",
    data: response,
  });
};

export const getPosterProfile = async (req, res) => {
  try {
    const posterId = req.user._id;
    const response = await getPosterProfileService(posterId);

    if (response.error) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: response.error,
      });
    }

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Poster profile fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error("getPosterProfile controller error:", error.message);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const switchRoleToWorker = async (req, res) => {
  const response = await switchRoleToWorkerService ({user: req.user, data: req.body, files: req.files});
  if(response.forbidden){
    return res.status(STATUS_CODES.FORBIDDEN).json({success: false, message: response.forbidden})
  }
  if( response.error ){
    return res.status(STATUS_CODES.BAD_REQUEST).json({success: false, message: response.error});
  }

  return res.status(STATUS_CODES.OK).json({success: true, message: response.message})
}

export const posterRoleSwitchAlreadyDataUploaded = async (req, res) => {
  const response = await posterRoleSwitchAlreadyDataUploadedService({user: req.user});
  if(response.forbidden){
    return res.status(STATUS_CODES.FORBIDDEN).json({success:false, message: response.forbidden});
  }
  
  if(response.error){
    return res.status(STATUS_CODES.BAD_REQUEST).json({success:false, message: response.error});
  }

  return res.status(STATUS_CODES.OK).json({success:true, message: response.message})
}

export const getPosterNotifications = async (req, res) => {
  try {
    const posterId = req.user._id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 6);
    const filter = req.query.filter || "all";

    const result = await getPosterNotificationsService(posterId, { page, limit, filter });
    return res.status(STATUS_CODES.OK).json(result);
  } catch (error) {
    console.error("getPosterNotifications error:", error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const markAllPosterNotificationsRead = async (req, res) => {
  try {
    const posterId = req.user._id;
    const result = await markAllPosterNotificationsReadService(posterId);
    return res.status(STATUS_CODES.OK).json(result);
  } catch (error) {
    console.error("markAllPosterNotificationsRead error:", error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const markPosterNotificationRead = async (req, res) => {
  try {
    const posterId = req.user._id;
    const { id } = req.params;
    const result = await markPosterNotificationReadService(posterId, id);
    if (result.error) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: result.error });
    }
    return res.status(STATUS_CODES.OK).json(result);
  } catch (error) {
    console.error("markPosterNotificationRead error:", error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getPosterUnreadCount = async (req, res) => {
  try {
    const posterId = req.user._id;
    const result = await getPosterUnreadCountService(posterId);
    return res.status(STATUS_CODES.OK).json(result);
  } catch (error) {
    console.error("getPosterUnreadCount error:", error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};