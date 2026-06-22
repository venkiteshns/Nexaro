import Task from "../models/taskSchema.js";
import cloudinary from "../config/cloudinary.js";
import Bid from "../models/bidsSchema.js";
import mongoose from "mongoose";
import user from "../models/userSchema.js";
import { getIo } from "../socket.js";
import ngeohash from 'ngeohash';



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
            urgencyLevel: body.urgencyLevel || "flexible",
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

        // notify nearby workers

        const [task_lng, task_lat] = taskData.location.coordinates;

        const taskGeoHash = ngeohash.encode(task_lat, task_lng, 4);
        console.log(taskGeoHash, "taskGeoHash");

        const neighbors = ngeohash.neighbors(taskGeoHash);
        console.log(neighbors, "neighbours");

        const zonesToNotiffy = [taskGeoHash, ...neighbors];

        const io = getIo();
        zonesToNotiffy.forEach((zone) => {
            io.to(`zone:${zone}`).emit('new-task-nearby', {
                taskTitle: createdTask.title,
                taskId: createdTask._id,
                amount: createdTask.amount,
                category: createdTask.category,
                urgencyLevel: createdTask.urgencyLevel,
                city: createdTask.address.city,
            })
        })

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
                    "taskDetails._id": 1,
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
    // console.log(task, user);

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
        const posterId = isTask[0].posterId;
        console.log("posterId", posterId);
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
        // user:${userId}
        const io = getIo()

        io.to(`user:${posterId}`).emit('new-bid-added', {
            taskTitle: isTask[0].title,
            bidAmount,
        })

        let newBid = await Bid.create(payload)
        // console.log("new bid created ", newBid);
        return "bid created successfully"
    } catch (error) {
        console.log(error);
        if (error.message) {
            return { error: error.message }
        }
        return { error: "Failed to create bid" }
    }
}

export const getNearbyTasksService = async (workerId, { search, category, page = 1, limit = 9 }) => {
    console.log(search, category, page, limit);

    try {
        const worker = await user.findById(workerId);

        if (!worker) {
            return { error: "Worker not found" };
        }

        const hasServiceArea =
            worker.serviceArea &&
            worker.serviceArea.coordinates &&
            worker.serviceArea.coordinates.length === 2;

        if (!hasServiceArea) {
            return { error: "Worker service area location is not set. Please update your profile." };
        }

        const [lng, lat] = worker.serviceArea.coordinates;
        const skip = (page - 1) * limit;

        let matchCriterias = {};

        if (search) {
            matchCriterias.title = { $regex: search, $options: "i" };
        }
        if (category) {
            matchCriterias.category = category;
        }

        const result = await Task.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [lng, lat],
                    },
                    distanceField: "distance",
                    maxDistance: 50000,
                    spherical: true,
                },
            },
            {
                $facet: {
                    categoryList: [
                        { $group: { _id: "$category" } },
                        { $match: { _id: { $ne: null } } },
                        { $project: { _id: 1 } },
                        { $sort: { _id: 1 } },
                    ],
                    totalCount: [
                        { $match: matchCriterias },
                        { $count: "count" }
                    ],
                    tasks: [
                        { $match: matchCriterias },
                        {
                            $lookup: {
                                from: "bids",
                                localField: "_id",
                                foreignField: "taskId",
                                as: "bids"
                            }
                        },
                        {
                            $addFields: {
                                bidCount: { $size: "$bids" },
                                myBid: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$bids",
                                                as: "bid",
                                                cond: {
                                                    $eq: [
                                                        "$$bid.workerId",
                                                        new mongoose.Types.ObjectId(workerId)
                                                    ]
                                                }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                title: 1,
                                category: 1,
                                urgencyLevel: 1,
                                amount: 1,
                                address: 1,
                                location: 1,
                                distance: 1,
                                bidCount: 1,
                                "myBid.amount": 1,
                                "myBid.status": 1,
                            }
                        },
                        { $sort: { createdAt: 1 } },
                        { $skip: skip },
                        { $limit: Number(limit) },
                    ]
                }
            }
        ]);

        const categoryList = result[0].categoryList.map((c) => c._id);
        const total = result[0].totalCount[0]?.count || 0;
        const totalPages = Math.ceil(total / limit);

        return {
            tasks: result[0].tasks,
            categoryList,
            pagination: { total, page: Number(page), limit: Number(limit), totalPages }
        };

    } catch (error) {
        console.error("getNearbyTasksService error:", error);
        return { error: "Something went wrong while fetching nearby tasks." };
    }
};

export const getWorkerBidDetailsService = async (bidId, workerId) => {
    try {
        const bidDetails = await Bid.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(bidId) } },
            {
                $lookup: {
                    from: 'tasks',
                    localField: 'taskId',
                    foreignField: '_id',
                    as: "taskDetails"
                }
            },
            { $unwind: { path: "$taskDetails", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'taskDetails.posterId',
                    foreignField: "_id",
                    as: "posterDetails"
                }
            },
            { $unwind: { path: '$posterDetails', preserveNullAndEmptyArrays: true } },

            // ── All bids on the same task (for competition insight) ──────────────
            {
                $lookup: {
                    from: 'bids',
                    localField: 'taskId',
                    foreignField: 'taskId',
                    as: 'allBidsOnTask'
                }
            },
            {
                $addFields: {
                    otherBids: {
                        $filter: {
                            input: '$allBidsOnTask',
                            as: 'b',
                            cond: { $ne: ['$$b._id', new mongoose.Types.ObjectId(bidId)] }
                        }
                    }
                }
            },

            // ── final values ──
            {
                $project: {
                    _id: 1,
                    taskId: 1,
                    amount: 1,
                    eta: 1,
                    pitch: 1,
                    status: 1,
                    availability: 1,
                    // Task fields
                    title: '$taskDetails.title',
                    description: '$taskDetails.description',
                    category: '$taskDetails.category',
                    deadline: '$taskDetails.deadline',
                    location: '$taskDetails.location',
                    address: '$taskDetails.address',
                    budget: '$taskDetails.amount',
                    postedAt: '$taskDetails.createdAt',
                    urgencyLevel: '$taskDetails.urgencyLevel',
                    images: '$taskDetails.images',
                    // Poster info
                    posterName: '$posterDetails.name',
                    posterPicture: {
                        $ifNull: [
                            '$posterDetails.verificationDocuments.selfie.url',
                            process.env.USER_ICON
                        ]
                    },
                    // Competition
                    otherBidCount: { $size: '$otherBids' },
                    averageBid: {
                        $cond: {
                            if: { $gt: [{ $size: '$allBidsOnTask' }, 0] },
                            then: { $avg: '$allBidsOnTask.amount' },
                            else: null
                        }
                    },
                }
            }
        ]);

        if (!bidDetails || bidDetails.length === 0) {
            return { error: "Bid not found" };
        }

        const bid = bidDetails[0];
        // console.log(bidDetails[0]);


        return {
            bid: {
                _id: bid._id,
                taskId: bid.taskId,
                amount: bid.amount,
                eta: bid.eta,
                pitch: bid.pitch,
                status: bid.status,
                availability: bid.availability,
            },
            task: {
                title: bid.title,
                description: bid.description,
                category: bid.category,
                deadline: bid.deadline,
                location: bid.location,
                address: bid.address,
                budget: bid.budget,
                postedAt: bid.postedAt,
                urgencyLevel: bid.urgencyLevel,
                images: bid.images,
            },
            poster: {
                name: bid.posterName,
                picture: bid.posterPicture,
            },
            competition: {
                otherBidCount: bid.otherBidCount,
                averageBid: bid.averageBid ? Math.round(bid.averageBid) : null,
            }
        };

    } catch (error) {
        console.error("getWorkerBidDetailsService error:", error.message);
        return { error: "Something went wrong while fetching bid details." };
    }
}

export const withdrawBidService = async (bidId) => {
    console.log(bidId);

    try {
        const bid = await Bid.findByIdAndDelete({ _id: bidId })
        console.log(bid);
        // const bid = await Bid.findByIdAndDelete(bidId)

        if (!bid) {
            return { error: "Bid not found" }
        }
        return { message: "Bid withdrawn successfully" }
    } catch (error) {
        console.error("withdrawBidService error:", error.message);
        return { error: "Something went wrong while withdrawing bid." };
    }
}

export const cancelTaskByPosterService = async (taskId) => {
    console.log(taskId);
    try {
        const taskData = await Task.findById({ _id: taskId });
        if (!taskData) {
            return { error: "Task not found" }
        }
        taskData.status = "cancelled"
        await taskData.save()
        return { message: "Task cancelled successfully" }
    } catch (error) {
        console.error("cancelTaskByPosterService error:", error.message);
        return { error: "Something went wrong while cancelling task." };
    }
}

export const getWorkerActiveJobService = async (taskId, workerId) => {
    try {
        const result = await Task.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(taskId),
                    workerId: new mongoose.Types.ObjectId(workerId),
                }
            },
            // Join poster (user)
            {
                $lookup: {
                    from: 'users',
                    localField: 'posterId',
                    foreignField: '_id',
                    as: 'poster'
                }
            },
            { $unwind: { path: '$poster', preserveNullAndEmptyArrays: true } },
            // Join accepted bid
            {
                $lookup: {
                    from: 'bids',
                    localField: 'acceptedBid',
                    foreignField: '_id',
                    as: 'bid'
                }
            },
            { $unwind: { path: '$bid', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    category: 1,
                    description: 1,
                    address: 1,
                    location: 1,
                    update: 1,
                    status: 1,
                    amount: 1,
                    createdAt: 1,
                    'poster.name': 1,
                    'poster.phone': 1,
                    'poster.selfie': { $ifNull: ['$poster.verificationDocuments.selfie.url', null] },
                    'bid.amount': 1,
                    'bid.eta': 1,
                }
            }
        ]);

        if (!result[0]) return { error: "Active job not found" };

        return result[0];
    } catch (error) {
        console.error("getWorkerActiveJobService error:", error.message);
        return { error: error.message };
    }
};

export const updateJobProgressService = async (taskId, workerId, update) => {
    const VALID = ['not_started', 'arrived', 'discussed', 'started', 'completed', 'payment'];
    if (!VALID.includes(update)) return { error: "Invalid progress step" };

    try {
        const task = await Task.findOneAndUpdate(
            { _id: taskId, workerId },
            { $set: { update } },
            { returnDocument: 'after' }
        );
        if (update === "arrived") {
            const updatedTask = await Task.findById(taskId)
            updatedTask.status = "in_progress"
            await updatedTask.save()
        }
        if (update === "completed") {
            const updatedTask = await Task.findById(taskId)
            updatedTask.status = "completed"
            await updatedTask.save()
        }
        if (!task) return { error: "Task not found or unauthorized" };
        return { message: "Progress updated successfully", update: task.update };
    } catch (error) {
        console.error("updateJobProgressService error:", error.message);
        return { error: error.message };
    }
};