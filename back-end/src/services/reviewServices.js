import Task from "../models/taskSchema.js";
import Review from "../models/reviewSchema.js";
import mongoose from "mongoose";
import MESSAGES from "../constants/messages.js";

export const createReviewService = async ({ taskId, reviewee, rating, review }, reviewerId) => {
  try {
    // 1. Validate taskId format
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return { error: MESSAGES.TASK_NOT_FOUND };
    }
    if (!mongoose.Types.ObjectId.isValid(reviewee)) {
      return { error: MESSAGES.REVIEWEE_MISMATCH };
    }

    // 2. Validate rating
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return { error: MESSAGES.INVALID_RATING };
    }

    // 3. Validate review text
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

    // 4. Fetch the task
    const task = await Task.findById(taskId);
    if (!task) {
      return { error: MESSAGES.TASK_NOT_FOUND };
    }

    // 5. Verify the authenticated user is the poster of this task
    if (task.posterId.toString() !== reviewerId.toString()) {
      return { error: MESSAGES.UNAUTHORIZED_REVIEWER, unauthorized: true };
    }

    // 6. Verify task is in a reviewable state (payment must be released)
    if (task.status !== "completed" || task.update !== "payment") {
      return { error: MESSAGES.TASK_NOT_ELIGIBLE_FOR_REVIEW };
    }

    // 7. Verify reviewee matches the worker on the task
    if (!task.workerId || task.workerId.toString() !== reviewee.toString()) {
      return { error: MESSAGES.REVIEWEE_MISMATCH };
    }

    // 8. Prevent duplicate review
    const existing = await Review.findOne({
      taskId: new mongoose.Types.ObjectId(taskId),
      reviewer: new mongoose.Types.ObjectId(reviewerId),
    });
    if (existing) {
      return { error: MESSAGES.REVIEW_ALREADY_EXISTS, duplicate: true };
    }

    // 9. Create the review
    const newReview = await Review.create({
      taskId: new mongoose.Types.ObjectId(taskId),
      reviewer: new mongoose.Types.ObjectId(reviewerId),
      reviewee: new mongoose.Types.ObjectId(reviewee),
      rating: ratingNum,
      review: trimmedReview,
      isDeleted: false,
    });

    return { review: newReview };
  } catch (error) {
    console.error("createReviewService error:", error.message);
    return { error: MESSAGES.INTERNAL_SERVER_ERROR };
  }
};
