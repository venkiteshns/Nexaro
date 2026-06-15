import User from "../models/userSchema.js";
import { hashData } from "../utils/hasing.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import Task from "../models/taskSchema.js";
import mongoose from "mongoose";
import Bid from "../models/bidsSchema.js";

export const posterSignupService = async (data) => {
    console.log("signUp data", data);
    try {
        // 1. Duplicate check
        const existing = await User.findOne({ email: data.email });
        if (existing) {
            throw new Error("User Already Exists");
        }

        // 2. Parse coordinates — must be finite numbers for 2dsphere index
        const locationLat = parseFloat(data.locationLat);
        const locationLng = parseFloat(data.locationLng);
        const hasValidLocation = isFinite(locationLat) && isFinite(locationLng);

        // 3. Hash password
        const hashedPassword = await hashData(data.password);

        // 4. Build clean payload (no frontend-only fields)
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
            activeRole: "poster"
        };

        // 5. Attach GeoJSON location only when coordinates are valid
        if (hasValidLocation) {
            payload.location = {
                type: "Point",
                coordinates: [locationLng, locationLat], // GeoJSON: [lng, lat]
            };
        }

        // 6. Create user
        const createdUser = await User.create(payload);

        // 7. Generate tokens
        const accessToken = generateAccessToken(createdUser);
        const refreshToken = generateRefreshToken(createdUser);

        createdUser.refreshToken = refreshToken;
        await createdUser.save({ validateBeforeSave: false });

        const { _id, name, email, activeRole } = createdUser;
        const responseUser = { id: _id, name, email, role: activeRole };

        return { responseUser, accessToken, refreshToken };

    } catch (error) {
        console.error("posterSignupService error:", error.message);
        return { error: error.message };
    }
};

export const getTasksService = async (posterId) => {
    try {
        // const tasks = await Task.find({ posterId });
        const tasks = await Task.aggregate([
            { $match: { posterId: new mongoose.Types.ObjectId(posterId) } },
            {
                $lookup: {
                    from: 'bids',
                    localField: '_id',
                    foreignField: 'taskId',
                    as: 'bids'
                }
            },
            {
                $addFields: {
                    bidCount: { $size: "$bids" }
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    createdAt: 1,
                    status: 1,
                    amount: 1,
                    bidCount: 1,
                    address: 1,
                }
            }
        ])
        console.log(tasks);

        if (!tasks) {
            throw new Error("No tasks found");
        }
        return tasks;
    } catch (error) {
        console.error("getTasksService error:", error.message);
        return { error: error.message };
    }
};

export const getPosterBidsService = async (taskId, sort) => {
    let sortCriteria = {}
    if (sort === "Newest First") {
        sortCriteria = { createdAt: -1 }
    } else if (sort === "Lowest Bid") {
        sortCriteria = { amount: 1 }
    } else if (sort === "Highest Bid") {
        sortCriteria = { amount: -1 }
    } else if (sort === "Highest Rated") {
        sortCriteria = { "worker.rating": -1 }
    }
    try {
        let bids = await Bid.aggregate([
            { $match: { taskId: new mongoose.Types.ObjectId(taskId) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'workerId',
                    foreignField: '_id',
                    as: 'worker'
                }
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
                }
            },
            { $sort: sortCriteria }

        ])
        if (!bids || bids.length === 0) {
            return { error: "No bids found" };
        }
        let task = await Task.findOne({ _id: taskId });
        return { bids, task }

    } catch (error) {
        console.error("getPosterBidsService error:", error.message);
        return { error: error.message };
    }
}

export const acceptBidService = async (bidId) => {
    try {
        const acceptedBid = await Bid.findOneAndUpdate(
            { _id: bidId },
            { $set: { status: "accepted" } },
            { returnDocument: 'after' }
        );

        if (!acceptedBid) {
            return { error: "Bid not found" };
        }

        const taskId = acceptedBid.taskId;

        const { modifiedCount: rejectedCount } = await Bid.updateMany(
            { _id: { $ne: bidId }, taskId },
            { $set: { status: "rejected" } }
        );

        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId },
            { $set: { status: "assigned", workerId: acceptedBid.workerId, acceptedBid: bidId } },
            { returnDocument: 'after' }
        );

        return {
            success: true,
            acceptedBid,
            rejectedCount,
            task: updatedTask,
        };

    } catch (error) {
        console.error("acceptBidService error:", error.message);
        return { error: error.message };
    }
}