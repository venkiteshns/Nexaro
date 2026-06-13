import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Tasks"
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    amount: {
        type: Number,
        required: true
    },
    eta: {
        type: String,
        required: true,
    },
    pitch: {
        type: String,
        required: true
    },
    availability: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }

}, { timestamps: true });

const Bid = mongoose.model("Bid", bidSchema);
export default Bid;
