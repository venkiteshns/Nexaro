import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        posterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        workerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        acceptedBid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bid",
            default: null,
        },

        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        deadline: {
            type: Date,
            required: true,
        },

        urgencyLevel: {
            type: String,
            enum: ["flexible", "normal", "urgent"],
            default: "normal",
        },

        images: [
            {
                url: String,
                format: String,
                public_id: String,
            },
        ],

        amount: {
            type: Number,
            default: 0,
        },

        platformFee: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["open", "assigned", "in_progress", "completed", "cancelled"],
            default: "open",
        },

        update: {
            arrived: { type: Boolean, default: false },
            discussed: { type: Boolean, default: false },
            started: { type: Boolean, default: false },
            completed: { type: Boolean, default: false },
            payment: { type: Boolean, default: false },
        },

        address: {
            state: { type: String, required: true },
            district: { type: String, required: true },
            city: { type: String },
            area: { type: String },
            houseNumber: { type: String },
            landmark: { type: String },
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: undefined,
            },
            coordinates: {
                type: [Number],
                default: undefined,
            },
        },

        completedOn: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

taskSchema.index({ location: "2dsphere" }, { sparse: true });

const Task = mongoose.model("Task", taskSchema);

export default Task;
