import mongoose from "mongoose";
import jwt from "jsonwebtoken";

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
    serviceAreaName: {
        type: String,
    },
    serviceArea: {
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
    skills: {
        type: [String],
    },
    languages: {
        type: [String],
    },
    bio: {
        type: String,
    },
    verificationDocuments: {
        selfie: {
            url: {
                type: String,
                default: ""
            },
            public_id: {
                type: String,
                default: ""
            }
        },
        idType: {
            type: String,
            default: ""
        },
        idFront: {
            url: {
                type: String,
                default: ""
            },
            public_id: {
                type: String,
                default: ""
            }
        },
        idBack: {
            url: {
                type: String,
                default: ""
            },
            public_id: {
                type: String,
                default: ""
            }
        }
    },
    refreshToken: {
        type: String,
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

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email, name: this.name },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};

userSchema.index({ location: "2dsphere" });
userSchema.index({ serviceArea: "2dsphere" });


const user = mongoose.model("User", userSchema);

export default user;