import Task from "../models/taskSchema.js";
import cloudinary from "../config/cloudinary.js";
import Bid from "../models/bidsSchema.js";
import mongoose from "mongoose";

const uploadImagesToCloudinary = async (files) => {
    const uploadPromises = files.map((file) =>
        cloudinary.uploader.upload(file.path, {
            folder: "Nexaro/tasks",
            resource_type: "auto",
        })
    );

    const results = await Promise.all(uploadPromises);

    return results.map((result) => ({
        url: result.secure_url,
        format: result.format,
        public_id: result.public_id,
    }));
};

export const createTaskService = async (body, files, posterId) => {
    console.log(body, files, posterId)
    try {
        const address = JSON.parse(body.address);
        const location = JSON.parse(body.location);
        let images = [];
        if (files && files.length > 0) {
            images = await uploadImagesToCloudinary(files);
        }

        const [lng, lat] = location.coordinates;
        const hasValidLocation = isFinite(lng) && isFinite(lat);

        const taskData = {
            posterId,
            title: body.title,
            description: body.description,
            category: body.category,
            deadline: new Date(body.deadline),
            urgencyLevel: body.urgency || "flexible",
            amount: Number(body.amount) || 0,
            images,
            address,
            status: "open",
        };

        if (hasValidLocation) {
            taskData.location = {
                type: "Point",
                coordinates: [lng, lat],
            };
        }

        const createdTask = await Task.create(taskData);

        return { task: createdTask };

    } catch (error) {
        console.error("createTaskService error:", error.message);
        return { error: error.message };
    }
};

export const getTaskForBidService = async (taskId) => {
    console.log("taskId ", taskId);
    try {
        let task = await Task.find({ _id: taskId });
        if (!task) {
            return "No task found"
        }
        console.log(task, "task data");
        return task;

    } catch (error) {
        console.error("getTaskByIdService error:", error.message);
        return { error: error.message };
    }
}

export const getWorkerBidsService = async (workerId, { status, page, limit }) => {
    try {
        const workerMatch = { workerId: new mongoose.Types.ObjectId(workerId) };

        const statusFilter = status && status !== "all" ? { status } : {};

        const skip = (page - 1) * limit;

        const result = await Bid.aggregate([
            { $match: workerMatch },
            {
                $lookup: {
                    from: "tasks",
                    localField: "taskId",
                    foreignField: "_id",
                    as: "taskDetails",
                }
            },
            { $unwind: "$taskDetails" },
            {
                $lookup: {
                    from: "bids",
                    localField: "taskDetails._id",
                    foreignField: "taskId",
                    as: "bidsForTask",
                }
            },
            {
                $addFields: {
                    "taskDetails.bidCount": { $size: "$bidsForTask" }
                }
            },
            {
                $project: {
                    taskId: 1,
                    amount: 1,
                    status: 1,
                    createdAt: 1,
                    eta: 1,
                    "taskDetails.title": 1,
                    "taskDetails.category": 1,
                    "taskDetails.urgencyLevel": 1,
                    "taskDetails.bidCount": 1,
                    "taskDetails.amount": 1,
                }
            },
            { $sort: { createdAt: -1 } },

            {
                $facet: {
                    data: [
                        { $match: statusFilter },
                        { $skip: skip },
                        { $limit: limit },
                    ],
                    total: [
                        { $match: statusFilter },
                        { $count: "count" }
                    ],
                    pendingCount: [{ $match: { status: "pending" } }, { $count: "count" }],
                    acceptedCount: [{ $match: { status: "accepted" } }, { $count: "count" }],
                    rejectedCount: [{ $match: { status: "rejected" } }, { $count: "count" }],
                }
            }
        ]);

        const bids = result[0]?.data || [];
        const total = result[0]?.total[0]?.count || 0;
        const totalPages = Math.ceil(total / limit);
        const counts = {
            total: result[0]?.total[0]?.count || 0,
            all: (result[0]?.pendingCount[0]?.count || 0) +
                (result[0]?.acceptedCount[0]?.count || 0) +
                (result[0]?.rejectedCount[0]?.count || 0),
            pending: result[0]?.pendingCount[0]?.count || 0,
            accepted: result[0]?.acceptedCount[0]?.count || 0,
            rejected: result[0]?.rejectedCount[0]?.count || 0,
        };

        // console.log(total, page, limit, totalPages, counts);
        return { bids, total, page, limit, totalPages, counts };

    } catch (error) {
        console.error("getWorkerBidsService error:", error.message);
        return { error: error.message };
    }
};


export const handleNewBid = async (task, user) => {
    console.log(task, user);

    try {
        let { taskId, bidAmount, estimatedTime, pitch } = task;
        let isTask = await Task.find({ _id: taskId });
        if (!isTask) {
            return { error: "No task found" }
        }
        let isAlreadyBid = await Bid.findOne({
            taskId,
            workerId: user._id
        })
        console.log("already bid", isAlreadyBid);

        if (isAlreadyBid) {
            return { error: "You have already bid on this task" }
        }
        let payload = {
            taskId,
            workerId: user._id,
            amount: bidAmount,
            eta: estimatedTime,
            pitch,
            availability: new Date(task.availableDate + "T" + task.availableTime),
            status: "pending"
        }
        // console.log(payload, "bid payload");

        let newBid = await Bid.create(payload)
        console.log("new bid created ", newBid);
        return "bid created successfully"
    } catch (error) {
        console.log(error);
        if (error.message) {
            return { error: error.message }
        }
        return { error: "Failed to create bid" }
    }
}