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
    serviceArea: {
        type: {
            type: String,
            enum: ["Point"]
        },
        coordinates: {
            type: [Number]
        }
    },
    skills: {
        type: [String],
        required: true
    },
    languages: {
        type: [String],
        required: true
    },
    verificationDocuments: {
        idType: {
            type: String
        },
        idFront: {
            url: String,
            format: String,
            public_id: String
        },
        idBack: {
            url: String,
            format: String,
            public_id: String
        },
        selfie: {
            url: String,
            format: String,
            public_id: String
        }
    },
    bio: {
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
    location: {
        type: {
            type: String,
            enum: ["Point"]
        },
        coordinates: {
            type: [Number]
        }
    },
    worker: {
        isLive: {
            type: Boolean,
            default: true
        },
        rating: {
            type: Number,
            default: 0
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
    },
    refreshToken: {
        type: String,
        default: ""
    }
}, { timestamps: true })

// ── JWT instance methods ──────────────────────────────────────────────────

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: this.role,
            activeRole: this.activeRole
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "10d" }
    );
};

// Sparse 2dsphere index: documents without a location field are skipped,
// preventing the "Point must only contain numeric elements" error on signup.
userSchema.index({ location: "2dsphere" }, { sparse: true });

const user = mongoose.model("User", userSchema);

export default user;