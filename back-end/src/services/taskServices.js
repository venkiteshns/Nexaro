import Task from "../models/taskSchema.js";
import cloudinary from "../config/cloudinary.js";
import Bid from "../models/bidsSchema.js";

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