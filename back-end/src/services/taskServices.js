import Task from "../models/taskSchema.js";
import cloudinary from "../config/cloudinary.js";
import Bid from "../models/bidsSchema.js";
import mongoose from "mongoose";
import user from "../models/userSchema.js";
import { getIo } from "../socket.js";
import ngeohash from 'ngeohash';



const deleteImagesFromCloudinary = async (publicIds) => {
    if (!publicIds || publicIds.length === 0) return;
    await Promise.all(
        publicIds.map((id) => cloudinary.uploader.destroy(id))
    );
};

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
    // console.log(body, files, posterId)
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
        // console.log(taskGeoHash, "taskGeoHash");

        const neighbors = ngeohash.neighbors(taskGeoHash);
        // console.log(neighbors, "neighbours");

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
    try {
        const task = await Task.find({ _id: new mongoose.Types.ObjectId(taskId) });
        if (!task) {
            return "No task found"
        }
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
        const { taskId, bidAmount, estimatedTime, pitch } = task;
        const isTask = await Task.find({ _id: taskId });
        if (!isTask) {
            return { error: "No task found" }
        }
        const isAlreadyBid = await Bid.findOne({
            taskId,
            workerId: user._id
        })
        const posterId = isTask[0].posterId;
        // console.log("posterId", isTask);
        // console.log("already bid", isAlreadyBid);

        if (isAlreadyBid) {
            return { error: "You have already bid on this task" }
        }

        const bidsDetails = await Bid.aggregate([
            {
                $match: {workerId: mongoose.Types.ObjectId(user._id)}
            },
            {
                $sort: {
                    createdAt: -1
                }
            }, 
            {
                $lookup: {
                    from: 'tasks',
                    localField: 'taskId',
                    foreignField: '_id',
                    as:'taskDetails'
                }
            }
        ]);

        // const date = Date.now();

        // let filteredMonthData = bidsDetails[0].filter((bid) => date - createdAt < 30);

        // const category = isTask.category;

        // const categoryCount = filteredMonthData.redcue((acc, task) => {
        //     acc[task.category] ? acc[task.category]+1 : 1;
        //     return acc;
        // },{})

        // if(categoryCount[category] >= 1){
        //     return {error: `cannot add new bid for category ${category} in this month`}
        // }

        const payload = {
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

        await Bid.create(payload)
        return "bid created successfully"
    } catch (error) {
        // console.log(error);
        if (error.message) {
            return { error: error.message }
        }
        return { error: "Failed to create bid" }
    }
}

export const getNearbyTasksService = async (workerId, { search, category, page = 1, limit = 9 }) => {
    // console.log(search, category, page, limit);

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

        const matchCriterias = {};

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
            { $match: { _id: new mongoose.Types.ObjectId(bidId), workerId: new mongoose.Types.ObjectId(workerId) } },
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
    // console.log(bidId);

    try {
        const bid = await Bid.findByIdAndDelete({ _id: bidId })
        // console.log(bid);
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

export const updateTaskService = async (taskId, posterId, body, newFiles) => {
    try {
        const task = await Task.findOne({ _id: taskId, posterId });
        if (!task) {
            return { error: "Task not found or unauthorized" };
        }

        if (task.status !== "open") {
            return { error: "Only open tasks can be edited" };
        }

        const bidCount = await Bid.countDocuments({ taskId });
        if (bidCount > 0) {
            return { error: "Cannot edit task — bids are already waiting" };
        }

        let imagesToKeep = [];
        if (body.retainedImages) {
            try {
                imagesToKeep = JSON.parse(body.retainedImages);
            } catch (_) {
                imagesToKeep = [];
            }
        }

        const removedImages = task.images.filter(
            (img) => !imagesToKeep.some((r) => r.public_id === img.public_id)
        );
        if (removedImages.length > 0) {
            await deleteImagesFromCloudinary(removedImages.map((i) => i.public_id));
        }

        let uploadedImages = [];
        if (newFiles && newFiles.length > 0) {
            uploadedImages = await uploadImagesToCloudinary(newFiles);
        }

        const finalImages = [...imagesToKeep, ...uploadedImages].slice(0, 5);

        if (finalImages.length === 0) {
            return { error: "At least 1 image is required" };
        }

        let address = task.address;
        if (body.address) {
            try { address = JSON.parse(body.address); } catch (_) { /* keep existing */ }
        }
        let location = task.location;
        if (body.location) {
            try { location = JSON.parse(body.location); } catch (_) { /* keep existing */ }
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            {
                $set: {
                    title: body.title || task.title,
                    description: body.description || task.description,
                    category: body.category || task.category,
                    deadline: body.deadline ? new Date(body.deadline) : task.deadline,
                    urgencyLevel: body.urgencyLevel || task.urgencyLevel,
                    amount: body.amount !== undefined ? Number(body.amount) : task.amount,
                    images: finalImages,
                    address,
                    location,
                },
            },
            { new: true }
        );

        return { task: updatedTask };
    } catch (error) {
        console.error("updateTaskService error:", error.message);
        return { error: error.message };
    }
};

export const getWorkerActiveJobService = async (taskId, workerId) => {
    try {
        const result = await Task.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(taskId),
                    workerId: new mongoose.Types.ObjectId(workerId),
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'posterId',
                    foreignField: '_id',
                    as: 'poster'
                }
            },
            { $unwind: { path: '$poster', preserveNullAndEmptyArrays: true } },
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
            updatedTask.completedOn = new Date();
            await updatedTask.save()
        }
        if (!task) return { error: "Task not found or unauthorized" };

        const io = getIo()
        io.to(`user:${task.posterId}`).emit("task-update", {
            taskTitle: task.title,
            update: task.update,
        })

        return { message: "Progress updated successfully", update: task.update };
    } catch (error) {
        console.error("updateJobProgressService error:", error.message);
        return { error: error.message };
    }
};