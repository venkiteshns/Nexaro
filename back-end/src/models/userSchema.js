import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        min: 0
    },
    password: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    workPlaces: {
        type: [String],
    },
    skills: {
        type: [String],
    },
    languages: {
        type: [String],
    },
    bio: {
        type: String,
    },
    displayPicture: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    activeRole: {
        type: String,
        enum: ["poster", "worker", "admin"],
        default: "poster"
    },
    role: {
        type: String,
        enum: ["poster", "worker", "admin"],
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    worker: {
        isLive: {
            type: Boolean,
            required: true
        },
        rating: {
            type: String
        }
    },
    poster: {
        spent: {
            type: Number,
            default: 0
        },
        refund: {
            type: Number,
            default: 0
        },
        inEscrow: {
            type: Number,
            default: 0
        }
    }
}, { timestamps: true })

const user = mongoose.model("User", userSchema);

export default user;