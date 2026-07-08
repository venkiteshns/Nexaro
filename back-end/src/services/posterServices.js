import User from "../models/userSchema.js";
import { hashData } from "../utils/hasing.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import Task from "../models/taskSchema.js";
import mongoose from "mongoose";
import Bid from "../models/bidsSchema.js";
import Review from "../models/reviewSchema.js";
import { getIo } from "../socket.js";

export const posterSignupService = async (data) => {
    // console.log("signUp data", data);
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
                    description: 1,
                    category: 1,
                    deadline: 1,
                    urgencyLevel: 1,
                    createdAt: 1,
                    status: 1,
                    amount: 1,
                    bidCount: 1,
                    address: 1,
                    location: 1,
                    images: 1,
                }
            }
        ])
        // console.log(tasks);

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
        const bids = await Bid.aggregate([
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
        const task = await Task.findOne({ _id: taskId });
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
        const workerId = acceptedBid.workerId;

        const { modifiedCount: rejectedCount } = await Bid.updateMany(
            { _id: { $ne: bidId }, taskId },
            { $set: { status: "rejected" } }
        );

        const rejectedWorkers = await Bid.find({ _id: { $ne: bidId }, taskId }).select("workerId");


        const platformFee = acceptedBid.amount * 5 / 100;
        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId },
            { $set: { status: "assigned", workerId: acceptedBid.workerId, acceptedBid: bidId, platformFee } },
            { returnDocument: 'after' }
        );

        const io = getIo();

        rejectedWorkers.forEach((worker) => {
            io.to(`user:${worker.workerId}`).emit("bid-rejected", {
                taskTitle: updatedTask.title,
                bidAmount: acceptedBid.amount,
            })
        })

        io.to(`user:${workerId}`).emit("bid-accepted", {
            taskTitle: updatedTask.title,
            bidAmount: acceptedBid.amount,
        })

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

export const getPosterTaskProgressService = async (taskId) => {
    try {
        const task = await Task.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(taskId) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'workerId',
                    foreignField: '_id',
                    as: 'worker'
                }
            },
            {
                $unwind: { path: "$worker", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: 'bids',
                    localField: 'acceptedBid',
                    foreignField: '_id',
                    as: 'bid'
                }
            },
            {
                $unwind: { path: "$bid", preserveNullAndEmptyArrays: true }
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
                    'worker.name': 1,
                    'worker.rating': '$worker.worker.rating',
                    'worker.phone': 1,
                    'worker.completedJobs': 1,
                    'worker.selfie': '$worker.verificationDocuments.selfie.url',
                    'bid.amount': 1,
                    'bid.eta': 1,
                }
            }
        ])


        if (!task[0]) {
            return { error: "Task not found" };
        }
        // console.log("task", task[0]);

        const result = task[0];
        const completedWork = await Task.find({ workerId: task[0].workerId, status: "completed" })
        result.worker.completedJobs = completedWork.length

        return result;

    } catch (error) {
        console.error("getPosterTaskProgressService error:", error.message);
        return { error: error.message };
    }
}

export const updateUserProfileService = async ({ userId, body }) => {
    try {
        console.log(body);
        
        const user = User.find({ _id: mongoose.Types.ObjectId(userId) });
        if (!user) {
            return ({ error: "user not found" });
        }
        // const { email, locat } = body;
        // user.email = email,
        //     user.address = address;
        // user.phone = phone,
        //     user.bio = bio;
        // await user.save();
        // return ({ message: "user profile updated successfully" })

    } catch (error) {
        return ({ error: error.message })
    }
}

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
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    }
                }
            }
        ]);

        const posterUser = await User.findById(posterObjectId).select('poster.spent verificationDocuments.selfie.url name email phone city createdAt');

        const stats = {
            totalPosted: taskStats?.totalPosted || 0,
            totalCompleted: taskStats?.totalCompleted || 0,
            totalSpent: posterUser?.poster?.spent || 0
        };

        const recentTasks = await Task.find({ posterId: posterObjectId })
            .sort({ createdAt: -1 })
            .limit(3)
            .select('_id title status amount category createdAt address');

        const reviews = await Review.aggregate([
            { $match: { reviewer: posterObjectId, isDeleted: false } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'reviewee',
                    foreignField: '_id',
                    as: 'worker'
                }
            },
            { $unwind: { path: '$worker', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'tasks',
                    localField: 'taskId',
                    foreignField: '_id',
                    as: 'task'
                }
            },
            { $unwind: { path: '$task', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    rating: 1,
                    comment: '$review',
                    createdAt: 1,
                    'workerName': '$worker.name',
                    'category': '$task.category',
                }
            },
            { $sort: { createdAt: -1 } }
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
                city: posterUser?.city || null,
                createdAt: posterUser?.createdAt || null,
                selfie: posterUser?.verificationDocuments?.selfie?.url || null,
            },
        };

    } catch (error) {
        console.error('getPosterProfileService error:', error.message);
        return { error: error.message };
    }
};

export const getCompletedTaskPosterSideService = async (taskId, posterId) => {
    try {
        const task = await Task.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(taskId),
                    status: 'completed',
                    posterId: new mongoose.Types.ObjectId(posterId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'workerId',
                    foreignField: '_id',
                    as: 'worker'
                }
            },
            {
                $unwind: { path: "$worker", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: 'bids',
                    localField: 'acceptedBid',
                    foreignField: '_id',
                    as: 'bid'
                }
            },
            {
                $unwind: { path: "$bid", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'taskId',
                    as: 'review'
                }
            },
            {
                $unwind: { path: "$review", preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    workerId: 1,
                    status: 1,
                    category: 1,
                    createdAt: 1,
                    address: 1,
                    amount: 1,
                    platformFee: 1,
                    completedOn: 1,
                    'worker.name': 1,
                    'worker.rating': '$worker.worker.rating',
                    'worker.phone': 1,
                    'worker.selfie': '$worker.verificationDocuments.selfie.url',
                    'worker.isVerified': 1,
                    'bid.amount': 1,
                    'bid.eta': 1,
                    'review': 1,
                }
            }
        ])
        if (!task) {
            return ({ error: "Task not found" });
        }

        return task;
    } catch (error) {
        return ({ error })
    }
}

