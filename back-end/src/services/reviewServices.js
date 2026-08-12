import Task from "../models/taskSchema.js";
import Review from "../models/reviewSchema.js";
import mongoose from "mongoose";
import MESSAGES from "../constants/messages.js";
import User from "../models/userSchema.js";

export const createReviewService = async ({ taskId, reviewee, rating, review }, reviewerId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return { error: MESSAGES.TASK_NOT_FOUND };
    }
    if (!mongoose.Types.ObjectId.isValid(reviewee)) {
      return { error: MESSAGES.REVIEWEE_MISMATCH };
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return { error: MESSAGES.INVALID_RATING };
    }

    if (!review || typeof review !== "string") {
      return { error: MESSAGES.REVIEW_REQUIRED };
    }

    const trimmedReview = review.trim();
    if (trimmedReview.length < 10) {
      return { error: MESSAGES.REVIEW_TOO_SHORT };
    }

    if (trimmedReview.length > 1000) {
      return { error: MESSAGES.REVIEW_TOO_LONG };
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return { error: MESSAGES.TASK_NOT_FOUND };
    }

    if (task.posterId.toString() !== reviewerId.toString()) {
      return { error: MESSAGES.UNAUTHORIZED_REVIEWER, unauthorized: true };
    }

    if (task.status !== "completed" || task.update !== "payment") {
      return { error: MESSAGES.TASK_NOT_ELIGIBLE_FOR_REVIEW };
    }

    if (!task.workerId || task.workerId.toString() !== reviewee.toString()) {
      return { error: MESSAGES.REVIEWEE_MISMATCH };
    }

    const existing = await Review.findOne({
      taskId: new mongoose.Types.ObjectId(taskId),
      reviewer: new mongoose.Types.ObjectId(reviewerId),
    });

    if (existing) {
      return { error: MESSAGES.REVIEW_ALREADY_EXISTS, duplicate: true };
    }

    const newReview = await Review.create({
      taskId: new mongoose.Types.ObjectId(taskId),
      reviewer: new mongoose.Types.ObjectId(reviewerId),
      reviewee: new mongoose.Types.ObjectId(reviewee),
      rating: ratingNum,
      review: trimmedReview,
      isDeleted: false,
    });

    const averageReview = await Review.aggregate([
      {
        $match: {reviewee : new mongoose.Types.ObjectId(reviewee)}
      },
      {
        $group: {
          _id: null,
          averageRating: {$avg: "$rating"}
        }
      }
    ])

    const newRating = averageReview.length > 0 ? averageReview[0].averageRating.toFixed(1) : 0;

    await User.updateOne(
      {_id: new mongoose.Types.ObjectId(reviewee)},
      {$set: {'worker.rating' : newRating}}
    )

    return { review: newReview };
  } catch (error) {
    console.error("createReviewService error:", error.message);
    return { error: MESSAGES.INTERNAL_SERVER_ERROR };
  }
};
