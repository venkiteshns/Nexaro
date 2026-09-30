import User from "../models/userSchema.js";
import { compareHash, hashData } from "../utils/hasing.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import Task from "../models/taskSchema.js";
import mongoose from "mongoose";
import Bid from "../models/bidsSchema.js";
import Review from "../models/reviewSchema.js";
import { getIo, updateUserRoleAndZoneRooms } from "../socket.js";
import { uploadManyFiles } from "../utils/uploadUtils.js";
import { recordAdminAlert } from "./adminNotificationService.js";
import PosterNotification from "../models/posterNotificationSchema.js";
import { syncPosterNotifications } from "./posterNotificationService.js";
import MESSAGES from "../constants/messages.js";
import { generateUniqueReferralCode } from "../utils/referralCode.js";
import { linkReferralOnSignup } from "./referralService.js";
import logger from "../utils/logger.js";

export const posterSignupService = async (data) => {
  try {
    const existing = await User.findOne({ $or: [{ email: data.email }, { phone: data.phone }] });
    if (existing) {
      if (existing.email === data.email) {
        throw new Error(MESSAGES.USER_ALREADY_EXIST_WITH_EMAIL || "User Already Exists");
      }
      if (existing.phone === Number(data.phone)) {
        throw new Error(MESSAGES.PHONE_ALREADY_IN_USE || "Phone number already in use");
      }
    }

    const locationLat = parseFloat(data.locationLat);
    const locationLng = parseFloat(data.locationLng);
    const hasValidLocation = isFinite(locationLat) && isFinite(locationLng);

    const hashedPassword = await hashData(data.password);

    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      country: data.country,
      state: data.state,
      district: data.district,
      city: data.city,
      isVerified: false,
      isDeleted: false,
      isSuspended: false,
      isGoogleAuth: Boolean(data.isGoogleAuth),
      activeRole: "poster",
      referralCode: await generateUniqueReferralCode(),
    };

    if (hasValidLocation) {
      payload.location = {
        type: "Point",
        coordinates: [locationLng, locationLat],
      };
    }

    const createdUser = await User.create(payload);

    if (data.referralCode) {
      await linkReferralOnSignup({
        newUserId: createdUser._id,
        referralCode: data.referralCode,
      });
    }

    const accessToken = generateAccessToken(createdUser);
    const refreshToken = generateRefreshToken(createdUser);

    createdUser.refreshToken = refreshToken;
    await createdUser.save({ validateBeforeSave: false });

    const { _id, name, email, activeRole, referralCode } = createdUser;
    const responseUser = {
      id: _id,
      name,
      email,
      role: activeRole,
      referralCode,
      selfie: process.env.DEFAULT_AVATAR_URL || null,
    };

    await recordAdminAlert({
      uniqueKey: `user_signup_${_id}`,
      type: "signup",
      title: "New User Sign Up",
      description: `${name} joined as a Poster.`,
      priority: "normal",
      dotColor: "blue",
      metadata: { userId: _id, role: activeRole },
    });

    return { responseUser, accessToken, refreshToken };
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      if (field === 'email') return { error: MESSAGES.USER_ALREADY_EXIST_WITH_EMAIL };
      if (field === 'phone') return { error: MESSAGES.PHONE_ALREADY_IN_USE };
      return { error: "An account with this information already exists." };
    }
    // Log unexpected errors only; validation throws are expected business logic
    const isValidationError = [
      MESSAGES.USER_ALREADY_EXIST_WITH_EMAIL,
      MESSAGES.PHONE_ALREADY_IN_USE,
    ].includes(error.message);
    if (isValidationError) {
      logger.warn(`posterSignupService validation: ${error.message}`);
    } else {
      logger.error(`posterSignupService error: ${error.message}`);
    }
    return { error: error.message };
  }
};

export const getTasksService = async (posterId, query) => {

  const { status, search = "", page = 1, limit = 5 } = query;

  const matchingCriteria = {
    posterId: new mongoose.Types.ObjectId(posterId),
  };

  if (status !== 'all') {
    matchingCriteria.status = query.status;
  }

  if (search.trim()) {
    matchingCriteria.$or = [
      {
        title: {
          $regex: search,
          $options: "i"
        },
      },
      {
        "address.landmark": {
          $regex: search,
          $options: "i"
        },
      },
      {
        "address.area": {
          $regex: search,
          $options: "i"
        }
      },
      {
        "address.city": {
          $regex: search,
          $options: "i"
        }
      }
    ]
  }

  const skip = (Number(page) - 1) * Number(limit);

  try {
    const tasks = await Task.aggregate([
      { $match: matchingCriteria },
      {
        $lookup: {
          from: "bids",
          localField: "_id",
          foreignField: "taskId",
          as: "bids",
        },
      },
      {
        $addFields: {
          bidCount: { $size: "$bids" },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: Number(limit)
      },
      {
        $lookup: {
          from: "reviews",
          let: { taskId: "$_id", posterId: { $toObjectId: posterId } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$taskId", "$$taskId"] },
                    { $eq: ["$reviewer", "$$posterId"] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
            { $limit: 1 },
            { $project: { _id: 1 } },
          ],
          as: "posterReview",
        },
      },
      {
        $addFields: {
          hasReview: { $gt: [{ $size: "$posterReview" }, 0] },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          category: 1,
          deadline: 1,
          urgencyLevel: 1,
          createdAt: 1,
          status: 1,
          update: 1,
          amount: 1,
          bidCount: 1,
          acceptedBid: 1,
          workerId: 1,
          address: 1,
          location: 1,
          images: 1,
          hasReview: 1,
        },
      },
    ]);
    const totalCount = await Task.countDocuments({ posterId: new mongoose.Types.ObjectId(posterId) })
    const openTasks = await Task.countDocuments({ posterId: new mongoose.Types.ObjectId(posterId), status: "open" });
    const inProgressTasks = await Task.countDocuments({ posterId: new mongoose.Types.ObjectId(posterId), status: "in_progress" });
    const assignedTasks = await Task.countDocuments({ posterId: new mongoose.Types.ObjectId(posterId), status: "assigned" });
    const completedTasks = await Task.countDocuments({ posterId: new mongoose.Types.ObjectId(posterId), status: "completed" });
    const cancelledTasks = await Task.countDocuments({ posterId: new mongoose.Types.ObjectId(posterId), status: "cancelled" });


    if (!tasks) {
      throw new Error("No tasks found");
    }
    return {
      tasks,
      stats: {
        openTasks,
        assignedTasks,
        inProgressTasks,
        completedTasks,
        cancelledTasks,
      },
      paginations: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / Number(limit))
      }
    };
  } catch (error) {
    logger.error("getTasksService error:", error.message);
    return { error: error.message };
  }
};

export const getPosterBidsService = async (taskId, sort) => {
  let sortCriteria = {};
  if (sort === "Newest First") {
    sortCriteria = { createdAt: -1 };
  } else if (sort === "Lowest Bid") {
    sortCriteria = { amount: 1 };
  } else if (sort === "Highest Bid") {
    sortCriteria = { amount: -1 };
  } else if (sort === "Highest Rated") {
    sortCriteria = { "worker.rating": -1 };
  }
  try {
    const bids = await Bid.aggregate([
      { $match: { taskId: new mongoose.Types.ObjectId(taskId) } },
      {
        $lookup: {
          from: "users",
          localField: "workerId",
          foreignField: "_id",
          as: "worker",
        },
      },
      { $unwind: "$worker" },
      {
        $project: {
          _id: 1,
          amount: 1,
          pitch: 1,
          eta: 1,
          "worker._id": 1,
          "worker.name": 1,
          "worker.selfie": "$worker.verificationDocuments.selfie.url",
          "worker.rating": "$worker.worker.rating",
          "worker.status": "$worker.worker.isLive",
          "task._id": 1,
          "task.title": 1,
          "task.amount": 1,
          "task.address": 1,
        },
      },
      { $sort: sortCriteria },
    ]);
    if (!bids || bids.length === 0) {
      return { error: "No bids found" };
    }
    const task = await Task.findOne({ _id: taskId });
    return { bids, task };
  } catch (error) {
    logger.error("getPosterBidsService error:", error.message);
    return { error: error.message };
  }
};

export const acceptBidService = async (bidId) => {
  try {
    const acceptedBid = await Bid.findOneAndUpdate(
      { _id: bidId },
      { $set: { status: "accepted" } },
      { returnDocument: "after" },
    );

    if (!acceptedBid) {
      return { error: "Bid not found" };
    }

    const taskId = acceptedBid.taskId;
    const workerId = acceptedBid.workerId;

    const { modifiedCount: rejectedCount } = await Bid.updateMany(
      { _id: { $ne: bidId }, taskId },
      { $set: { status: "rejected" } },
    );

    const rejectedWorkers = await Bid.find({
      _id: { $ne: bidId },
      taskId,
    }).select("workerId");

    const platformFee = (acceptedBid.amount * 5) / 100;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId },
      {
        $set: {
          status: "assigned",
          workerId: acceptedBid.workerId,
          acceptedBid: bidId,
          platformFee,
        },
      },
      { returnDocument: "after" },
    );

    const io = getIo();

    rejectedWorkers.forEach((worker) => {
      io.to(`user:${worker.workerId}`).emit("bid-rejected", {
        taskTitle: updatedTask.title,
        bidAmount: acceptedBid.amount,
      });
    });

    io.to(`user:${workerId}`).emit("bid-accepted", {
      taskTitle: updatedTask.title,
      bidAmount: acceptedBid.amount,
    });

    const poster = await User.findById(updatedTask.posterId).select("name").lean();
    await recordAdminAlert({
      uniqueKey: `bid_accepted_${updatedTask._id}`,
      type: "bid_accepted",
      title: "Bid Accepted",
      description: `Bid of ₹${Number(acceptedBid.amount).toLocaleString("en-IN")} accepted for "${updatedTask.title}" by ${poster?.name || "Poster"}.`,
      priority: "normal",
      dotColor: "emerald",
      metadata: { taskId: updatedTask._id, bidAmount: acceptedBid.amount },
    });

    return {
      success: true,
      acceptedBid,
      rejectedCount,
      task: updatedTask,
    };
  } catch (error) {
    logger.error("acceptBidService error:", error.message);
    return { error: error.message };
  }
};

export const getPosterTaskProgressService = async (taskId) => {
  try {
    const task = await Task.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(taskId) } },
      {
        $lookup: {
          from: "users",
          localField: "workerId",
          foreignField: "_id",
          as: "worker",
        },
      },
      {
        $unwind: { path: "$worker", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "bids",
          localField: "acceptedBid",
          foreignField: "_id",
          as: "bid",
        },
      },
      {
        $unwind: { path: "$bid", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          workerId: 1,
          update: 1,
          category: 1,
          createdAt: 1,
          address: 1,
          status: 1,
          "worker.name": 1,
          "worker.rating": "$worker.worker.rating",
          "worker.phone": 1,
          "worker.completedJobs": 1,
          "worker.selfie": "$worker.verificationDocuments.selfie.url",
          "bid.amount": 1,
          "bid.eta": 1,
          "bid._id": 1
        },
      },
    ]);

    if (!task[0]) {
      return { error: "Task not found" };
    }

    const result = task[0];
    const completedWork = await Task.find({
      workerId: task[0].workerId,
      status: "completed",
    });
    result.worker.completedJobs = completedWork.length;

    return result;
  } catch (error) {
    logger.error("getPosterTaskProgressService error:", error.message);
    return { error: error.message };
  }
};

export const updateUserProfileService = async ({ userId, body, avatar }) => {
  try {
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });
    if (!user) {
      return { error: "user not found" };
    }
    const { email, phone, avatarObject, avatarUrl, avatarKey, avatarFormat } = body;

    const isDuplicateEmail = await User.findOne({ email, _id: { $ne: userId } });
    if (isDuplicateEmail) {
      return { error: MESSAGES.EMAIL_ALREADY_IN_USE };
    }

    const isDuplicatePhone = await User.findOne({ phone, _id: { $ne: userId } });
    if (isDuplicatePhone) {
      return { error: MESSAGES.PHONE_ALREADY_IN_USE };
    }

    user.email = email;
    user.phone = phone;
    if (avatarObject) {
      const avatarObj = typeof avatarObject === "string" ? JSON.parse(avatarObject) : avatarObject;
      user.verificationDocuments.selfie = avatarObj;
    } else if (avatarUrl) {
      user.verificationDocuments.selfie = {
        url: avatarUrl,
        key: avatarKey || "",
        format: avatarFormat || "image/jpeg",
      };
    } else if (avatar && avatar.length > 0) {
      const uploadedAvatar = await uploadManyFiles([avatar], "avatars");
      user.verificationDocuments.selfie = uploadedAvatar[0];
    }
    await user.save();

    const selfieUrl =
      user?.verificationDocuments?.selfie?.url ||
      (typeof user?.verificationDocuments?.selfie === "string"
        ? user.verificationDocuments.selfie
        : null) ||
      process.env.DEFAULT_AVATAR_URL ||
      null;

    return {
      message: "user profile updated successfully",
      selfie: selfieUrl,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        selfie: selfieUrl,
        role: user.activeRole,
      },
    };
  } catch (error) {
    logger.error("updateUserProfileService error:", error);

    return { error: error.message };
  }
};

export const getPosterProfileService = async (posterId) => {
  try {
    const posterObjectId = new mongoose.Types.ObjectId(posterId);

    const [taskStats] = await Task.aggregate([
      { $match: { posterId: posterObjectId } },
      {
        $group: {
          _id: null,
          totalPosted: { $sum: 1 },
          totalCompleted: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
    ]);

    const posterUser = await User.findOne({ _id: posterObjectId, activeRole: "poster" }).select(
      "poster.spent verificationDocuments.selfie name email phone city district state createdAt languages skills serviceArea isVerified",
    );

    const hasWorkerData = Boolean(
      posterUser?.skills?.length > 0 &&
      posterUser?.languages?.length > 0 &&
      (posterUser?.serviceArea?.coordinates?.length === 2 ||
       Boolean(posterUser?.serviceArea?.area) ||
       Boolean(posterUser?.city))
    );

    const isWorkerActive = hasWorkerData;

    const stats = {
      totalPosted: taskStats?.totalPosted || 0,
      totalCompleted: taskStats?.totalCompleted || 0,
      totalSpent: posterUser?.poster?.spent || 0,
    };

    const recentTasks = await Task.find({ posterId: posterObjectId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("_id title status amount category createdAt address");

    const reviews = await Review.aggregate([
      { $match: { reviewer: posterObjectId, isDeleted: false } },
      {
        $lookup: {
          from: "users",
          localField: "reviewee",
          foreignField: "_id",
          as: "worker",
        },
      },
      { $unwind: { path: "$worker", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "tasks",
          localField: "taskId",
          foreignField: "_id",
          as: "task",
        },
      },
      { $unwind: { path: "$task", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          rating: 1,
          comment: "$review",
          createdAt: 1,
          workerName: "$worker.name",
          category: "$task.category",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    stats.reviewsGiven = reviews.length;

    return {
      stats,
      recentTasks,
      reviews,
      poster: {
        _id: posterObjectId,
        name: posterUser?.name || null,
        email: posterUser?.email || null,
        phone: posterUser?.phone || null,
        isWorkerActive,
        hasWorkerData,
        skills: posterUser?.skills || [],
        languages: posterUser?.languages || [],
        serviceArea: posterUser?.serviceArea || null,
        isVerified: Boolean(posterUser?.isVerified),
        city: posterUser?.city || null,
        district: posterUser?.district || null,
        state: posterUser?.state || null,
        createdAt: posterUser?.createdAt || null,
        selfie:
          posterUser?.verificationDocuments?.selfie?.url ||
          (typeof posterUser?.verificationDocuments?.selfie === "string"
            ? posterUser.verificationDocuments.selfie
            : null) ||
          process.env.DEFAULT_AVATAR_URL ||
          null,
      },
    };
  } catch (error) {
    logger.error("getPosterProfileService error:", error.message);
    return { error: error.message };
  }
};

export const getCompletedTaskPosterSideService = async (taskId, posterId) => {
  try {
    const task = await Task.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(taskId),
          status: "completed",
          posterId: new mongoose.Types.ObjectId(posterId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "workerId",
          foreignField: "_id",
          as: "worker",
        },
      },
      {
        $unwind: { path: "$worker", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "bids",
          localField: "acceptedBid",
          foreignField: "_id",
          as: "bid",
        },
      },
      {
        $unwind: { path: "$bid", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "taskId",
          as: "review",
        },
      },
      {
        $unwind: { path: "$review", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          workerId: 1,
          status: 1,
          category: 1,
          createdAt: 1,
          description: 1,
          photos: 1,
          address: 1,
          amount: 1,
          platformFee: 1,
          completedOn: 1,
          "worker.name": 1,
          "worker.rating": "$worker.worker.rating",
          "worker.phone": 1,
          "worker.selfie": "$worker.verificationDocuments.selfie.url",
          "worker.isVerified": 1,
          "bid.amount": 1,
          "bid.eta": 1,
          review: 1,
        },
      },
    ]);
    if (!task) {
      return { error: "Task not found" };
    }

    return task;
  } catch (error) {
    return { error };
  }
};

export const switchRoleToWorkerService = async ({ user, data, files }) => {
  if (!user._id) {
    return { forbidden: "Access Restricted!" }
  }
  const lat = data.lat || data.workPlacelat;
  const lng = data.lng || data.workPlacelng;
  if (!lat || !lng) {
    return { error: "Service Area Details are required!" };
  }
  if (!data.skills) {
    return { error: "Skills are required" };
  }
  if (!data.languages) {
    return { error: "Languages are required" };
  }
  if (!Array.isArray(files?.id_back) || files?.id_back.length <= 0) {
    return { error: "Please upload back side of the document" };
  }
  if (!Array.isArray(files?.id_front) || files?.id_front.length <= 0) {
    return { error: "Please upload front side of the document" };
  }
  if (!Array.isArray(files?.selfie) || files?.selfie.length <= 0) {
    return { error: "Please upload your selfie image for verification" };
  }

  const parsedSkills = JSON.parse(data.skills);
  const parsedLanguages = JSON.parse(data.languages);

  try {
    const userData = await User.findOne({ _id: new mongoose.Types.ObjectId(user._id), activeRole: "poster" })
    if (!userData) {
      return { error: MESSAGES.USER_NOT_FOUND }
    }

    const isPasswordValid = await compareHash(data.password, userData.password);

    if (!isPasswordValid) {
      return { error: MESSAGES.CURRENT_PASSWORD_INVALID };
    }

    if (userData.isSuspended) {
      return { error: MESSAGES.SUSPENDED_USER }
    }


    userData.activeRole = "worker";
    userData.skills = parsedSkills;
    userData.languages = parsedLanguages;
    if (!userData.serviceArea) {
      userData.serviceArea = { type: "Point", coordinates: [] };
    }
    userData.serviceArea.type = "Point";
    userData.isVerified = false;

    const lng = parseFloat(data.lng);
    const lat = parseFloat(data.lat);
    if (!isNaN(lng) && !isNaN(lat)) {
      userData.serviceArea.coordinates = [lng, lat];
    }
    if (data.workPlace || data.city || data.district) {
      userData.serviceArea.area = data.workPlace || data.city || data.district;
    }

    if (data.uploadedDocuments) {
      const docs = typeof data.uploadedDocuments === "string"
        ? JSON.parse(data.uploadedDocuments)
        : data.uploadedDocuments;
      userData.verificationDocuments = {
        idFront: docs.idFront || docs.id_front,
        idBack: docs.idBack || docs.id_back,
        selfie: docs.selfie,
      };
    } else if (files && Object.keys(files).length > 0) {
      const uploadedFiles = await uploadManyFiles(files, `user/${user._id}/verification`);

      if (uploadedFiles.error) {
        return { error: "Unable to upload images, try again later" };
      }
      userData.verificationDocuments = {
        idFront: uploadedFiles.id_front,
        idBack: uploadedFiles.id_back,
        selfie: uploadedFiles.selfie,
      };
    }

    await userData.save();

    await updateUserRoleAndZoneRooms(userData._id);
    const newAccessToken = generateAccessToken(userData);

    return {
      success: true,
      message: "Data uploaded Successfully",
      accessToken: newAccessToken,
      user: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        activeRole: userData.activeRole,
        profile_image: userData.profile_image,
        serviceArea: userData.serviceArea,
      },
    };
  } catch (error) {
    logger.error("switchRoleToWorkerService error:", error);

    return { error: MESSAGES.UNEXPECTED_ERROR }
  }
}

export const posterRoleSwitchAlreadyDataUploadedService = async ({ user }) => {
  if (!user) {
    return { forbidden: MESSAGES.UNAUTHORIZED_USER }
  }
  try {
    const isUser = await User.findOne({ _id: new mongoose.Types.ObjectId(user._id), activeRole: "poster" });
    if (!isUser) {
      return { error: MESSAGES.USER_NOT_FOUND }
    }

    const hasWorkerData = Boolean(
      isUser.skills?.length > 0 &&
      isUser.languages?.length > 0 &&
      (isUser.serviceArea?.coordinates?.length === 2 || isUser.serviceArea?.area || isUser.city)
    );

    if (!hasWorkerData) {
      return { error: "Worker profile data is missing. Please complete the registration form." };
    }

    isUser.activeRole = 'worker';
    await isUser.save();

    await updateUserRoleAndZoneRooms(isUser._id);
    const newAccessToken = generateAccessToken(isUser);

    return {
      success: true,
      message: "Role Updated",
      accessToken: newAccessToken,
      user: {
        _id: isUser._id,
        name: isUser.name,
        email: isUser.email,
        phone: isUser.phone,
        role: isUser.role,
        activeRole: isUser.activeRole,
        profile_image: isUser.profile_image,
        serviceArea: isUser.serviceArea,
      },
    };
  } catch (error) {
    logger.error("posterRoleSwitchAlreadyDataUploadedService error:", error);
    return { error: MESSAGES.UNEXPECTED_ERROR }
  }
}

export const getPosterNotificationsService = async (posterId, { page = 1, limit = 6, filter = "all" } = {}) => {
  const posterObjectId = new mongoose.Types.ObjectId(posterId);

  await syncPosterNotifications(posterId);

  const query = { posterId: posterObjectId };
  if (filter === "unread") {
    query.isRead = false;
  } else if (filter && filter !== "all") {
    query.category = filter;
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, parseInt(limit) || 6);
  const skip = (pageNum - 1) * limitNum;

  const [
    notifications,
    totalItems,
    allCount,
    unreadCount,
    paymentsCount,
    systemCount,
  ] = await Promise.all([
    PosterNotification.find(query).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limitNum).lean(),
    PosterNotification.countDocuments(query),
    PosterNotification.countDocuments({ posterId: posterObjectId }),
    PosterNotification.countDocuments({ posterId: posterObjectId, isRead: false }),
    PosterNotification.countDocuments({ posterId: posterObjectId, category: "payments" }),
    PosterNotification.countDocuments({ posterId: posterObjectId, category: "system" }),
  ]);

  const totalPages = Math.ceil(totalItems / limitNum) || 1;

  return {
    success: true,
    notifications,
    currentPage: pageNum,
    totalPages,
    totalItems,
    counts: {
      all: allCount,
      unread: unreadCount,
      payments: paymentsCount,
      system: systemCount,
    },
  };
};

export const markAllPosterNotificationsReadService = async (posterId) => {
  const posterObjectId = new mongoose.Types.ObjectId(posterId);
  await PosterNotification.updateMany({ posterId: posterObjectId, isRead: false }, { $set: { isRead: true } });
  return {
    success: true,
    message: "All notifications marked as read",
  };
};

export const markPosterNotificationReadService = async (posterId, notificationId) => {
  const posterObjectId = new mongoose.Types.ObjectId(posterId);
  const notifObjectId = new mongoose.Types.ObjectId(notificationId);
  const notification = await PosterNotification.findOneAndUpdate(
    { _id: notifObjectId, posterId: posterObjectId },
    { $set: { isRead: true } },
    { returnDocument: 'after' }
  );
  if (!notification) {
    return { error: "Notification not found" };
  }
  return {
    success: true,
    notification,
  };
};

export const getPosterUnreadCountService = async (posterId) => {
  const posterObjectId = new mongoose.Types.ObjectId(posterId);
  await syncPosterNotifications(posterId);
  const unreadCount = await PosterNotification.countDocuments({
    posterId: posterObjectId,
    isRead: false,
  });
  return {
    success: true,
    unreadCount,
  };
};