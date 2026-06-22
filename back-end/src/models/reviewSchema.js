import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: true
    },
    adminResponse: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;