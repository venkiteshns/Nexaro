import User from "../models/userSchema.js";
import Wallet from "../models/walletSchema.js"
import Review from "../models/reviewSchema.js";
import { hashData } from "../utils/hasing.js";
import { uploadManyFiles } from "../utils/uploadUtils.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import MESSAGES from "../constants/messages.js";
import mongoose from "mongoose";
import Transaction from "../models/transactionSchema.js";

export const workerSignupService = async ({ files, data }) => {

    try {
        const user = await User.findOne({ $or: [{ email: data.email }, { phone: data.phone }] })

        if (user) {
            if (user.email == data.email) {
                throw new Error(MESSAGES.USER_ALREADY_EXIST_WITH_EMAIL);
            }
            if (user.phone == data.phone) {
                throw new Error(MESSAGES.PHONE_ALREADY_IN_USE);
            }
            // This line should technically never be reached if the above conditions are exhaustive
        }

        const locationLat = parseFloat(data.locationLat);
        const locationLng = parseFloat(data.locationLng);
        const hasValidLocation = isFinite(locationLat) && isFinite(locationLng);

        const serviceAreaLat = parseFloat(data.workPlacelat);
        const serviceAreaLng = parseFloat(data.workPlacelng);
        const hasValidServiceArea = isFinite(serviceAreaLat) && isFinite(serviceAreaLng);

        let parsedSkills = [];
        let parsedLanguages = [];
        try { parsedSkills = typeof data.skill === 'string' ? JSON.parse(data.skill) : data.skill; } catch { /* ignore parsing errors */ }
        try { parsedLanguages = typeof data.language === 'string' ? JSON.parse(data.language) : data.language; } catch (e) {
            console.log("Parse error", e);
        }

        const hashedPassword = await hashData(data.password);

        const payLoad = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            country: data.country,
            state: data.state,
            district: data.district,
            city: data.city,
            bio: data.bio,
            verificationDocuments: {
                idType: data.idType
            },
            skills: parsedSkills,
            languages: parsedLanguages,
            isVerified: false,
            isDeleted: false,
            isSuspended: false,
            role: "worker",
            activeRole: "worker",
            worker: {
                isLive: false,
                rating: "0"
            }
        };

        // Only attach location when we have real coordinates
        if (hasValidLocation) {
            payLoad.location = {
                type: "Point",
                coordinates: [locationLng, locationLat]
            };
        }

        // Only attach serviceArea when we have real coordinates
        if (hasValidServiceArea) {
            payLoad.serviceArea = {
                area: data.workPlace,
                type: "Point",
                coordinates: [serviceAreaLng, serviceAreaLat]
            };
        }

        console.log("files", files);

        const uploadStatus = await uploadManyFiles(files, `user/${payLoad.email}/verification`);

        if (uploadStatus.error) {
            throw new Error("Error in Uploading Files")
        }

        payLoad.verificationDocuments.selfie = uploadStatus.selfie;
        payLoad.verificationDocuments.idFront = uploadStatus.id_front;
        payLoad.verificationDocuments.idBack = uploadStatus.id_back;

        console.log(payLoad);


        const createdUser = await User.create(payLoad);

        const accessToken = generateAccessToken(createdUser);
        const refreshToken = generateRefreshToken(createdUser);

        createdUser.refreshToken = refreshToken;
        await createdUser.save({ validateBeforeSave: false });
        const { _id, name, email, verificationDocuments, activeRole } = createdUser;
        const responseUser = { id: _id, name, email, selfie: verificationDocuments.selfie.url, role: activeRole };
        // console.log(responseUser);
        return { responseUser, accessToken, refreshToken };


    } catch (error) {
        console.log(error)
        return { error: error.message || MESSAGES.UNEXPECTED_ERROR };
    }
}

export const getWorkerProfileService = async (user) => {

    // 1 Check the user object
    if (!user) {
        return { error: MESSAGES.USER_NOT_FOUND }
    }

    try {

        // 2 Check if user exists in database

        const isUserExist = await User.findById(user._id)
        if (!isUserExist) {
            return { error: MESSAGES.USER_NOT_FOUND }
        }

        // 3 Prepare response 
        const userData = await User.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(user._id) }
            },
            {
                $lookup: {
                    from: 'tasks',
                    localField: "_id",
                    foreignField: "workerId",
                    as: "jobs"
                }
            },
            {
                $addFields: {
                    jobsCompleted: { $size: { $ifNull: ["$jobs", []] } }
                }
            },
            {
                $lookup: {
                    from: 'reviews',
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$reviewee", "$$userId"] }
                            }
                        },
                        {
                            $facet: {
                                totalCount: [
                                    {
                                        $count: 'count'
                                    }
                                ],
                                latestReviews: [
                                    {
                                        $lookup: {
                                            from: 'users',
                                            localField: 'reviewer',
                                            foreignField: '_id',
                                            as: "reviewerData"
                                        }
                                    },
                                    {
                                        $unwind: {
                                            path: "$reviewerData"
                                        }
                                    },
                                    {
                                        $project: {
                                            review: 1,
                                            rating: 1,
                                            "reviewerData.name": 1,
                                            "reviewerData.avatar": "$reviewerData.verificationDocuments.selfie.url"
                                        }
                                    },
                                    {
                                        $sort: { createdAt: -1 }
                                    },
                                    {
                                        $limit: 2
                                    }
                                ],
                                topRating: [
                                    {
                                        $sort: { rating: -1 }
                                    },
                                    {
                                        $limit: 1
                                    }
                                ]
                            }
                        }
                    ],
                    as: 'reviews'
                }
            },
            {
                $lookup: {
                    from: "wallets",
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'wallet'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    avatar: { $ifNull: ['$verificationDocuments.selfie.url', process.env.DEFAULT_AVATAR_URL] },
                    worker: 1,
                    jobsCompleted: 1,
                    "reviewDetails.reviews": {
                        $arrayElemAt: ["$reviews.latestReviews", 0]
                    },
                    "reviewDetails.Totalcount": {
                        $ifNull: [
                            {
                                $first: { $arrayElemAt: ["$reviews.totalCount.count", 0] }
                            }, 0
                        ]

                    },
                    "reviewDetails.topRating": {
                        $ifNull: [
                            {
                                $first: { $arrayElemAt: ["$reviews.topRating.rating", 0] }
                            }, 0
                        ]
                    },
                    wallet: { $arrayElemAt: ["$wallet", 0] },
                    bio: 1,
                    languages: 1,
                    skills: 1,
                    "address": {
                        $concat: ["$city", ", ", "$district"]
                    },
                    isVerified: 1,
                    phone: 1,
                    email: 1,
                }
            }
        ]);
        console.log(userData[0]);

        return { success: true, profileData: userData[0] }

    } catch (error) {
        console.log("Worker profile service error ", error);
        return { error: error.message || MESSAGES.UNEXPECTED_ERROR }
    }
}

export const updateWorkerProfileService = async ({ user, data, avatar }) => {
    console.log(user);

    // 1 Check Form Values
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user) {
        return { unauthorized: MESSAGES.UNAUTHORIZED_USER }
    }
    if (!data.email) {
        return { error: MESSAGES.EMAIL_REQUIRED }
    }
    if (!emailRegex.test(data.email)) {
        return { error: MESSAGES.INVALID_EMAIL }
    }
    if (!data.phone) {
        return { error: MESSAGES.PHONE_REQUIRED }
    }
    if (!data.bio) {
        return { error: "Bio is required" }
    }
    if (!data.skills) {
        return { error: "Please enter atleast one skill" }
    }
    if (!data.languages) {
        return { error: "Please enter atleast one language" }
    }
    try {
        const parsedLanguages = JSON.parse(data.languages)
        const parsedSkills = JSON.parse(data.skills)
        const isEmailExist = await User.findOne({ _id: { $ne: new mongoose.Types.ObjectId(user._id) }, email: data.email });
        if (isEmailExist) {
            return { error: MESSAGES.EMAIL_ALREADY_IN_USE };
        }
        const isPhoneExist = await User.findOne({ _id: { $ne: new mongoose.Types.ObjectId(user._id) }, phone: data.phone });
        if (isPhoneExist) {
            return { error: MESSAGES.PHONE_ALREADY_IN_USE };
        }
        const userData = await User.findOne({ _id: new mongoose.Types.ObjectId(user._id), activeRole: "worker" })
        if (!userData) {
            return { error: MESSAGES.USER_NOT_FOUND }
        }
        if (avatar && Array.isArray(avatar?.avatar) && avatar?.avatar.length > 0) {
            // upload avatar
            const uploadStatus = await uploadManyFiles(avatar, `user/${data.email}/verification`);
            if (uploadStatus.error) {
                return { error: "Unable to upload profile picture, Please try again." }
            }
            userData.verificationDocuments.selfie = uploadStatus.avatar;
        }
        userData.email = data.email;
        userData.phone = data.phone;
        userData.bio = data.bio;
        userData.skills = parsedSkills;
        userData.languages = parsedLanguages;

        await userData.save()

        return { success: true, message: MESSAGES.USER_PROFILE_UPDATED }
    } catch (error) {
        console.error("Worker profile update service error ", error);
        return { error: "Unexpected error occoured" }
    }
}

export const switchRoleToPosterService = async ({ user }) => {
    if (!user) {
        return { forbidden: MESSAGES.UNAUTHORIZED_USER }
    }
    try {
        const isUser = await User.findOne({ _id: new mongoose.Types.ObjectId(user._id), activeRole: "worker" });
        if (!isUser) {
            return { error: MESSAGES.USER_NOT_FOUND }
        }

        isUser.activeRole = 'poster';
        await isUser.save();

        return { success: true, message: "Role Updated" }
    } catch (error) {
        console.log("Role swiitch to poster without Data service error", error);
        return { error: MESSAGES.UNEXPECTED_ERROR }
    }
}

export const getAllReviewService = async ({ user, query }) => {
    if (!user) {
        return { forbidden: MESSAGES.UNAUTHORIZED_USER }
    }
    const page = Number(query.page);
    const limit = Number(query.limit);
    const skip = (Number(page) - 1) * limit;
    try {
        const isUser = await User.findOne({ _id: user._id });
        if (!isUser) {
            return { error: MESSAGES.USER_NOT_FOUND }
        }
        console.log(isUser.worker.rating);

        const reviewDatas = await Review.aggregate([
            {
                $facet: {
                    reviews: [
                        {
                            $match: { reviewee: isUser._id }
                        },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'reviewer',
                                foreignField: '_id',
                                as: "reviewerDetails"
                            }
                        },
                        {
                            $unwind: { path: "$reviewerDetails" }
                        },
                        {
                            $lookup: {
                                from: 'tasks',
                                localField: 'taskId',
                                foreignField: '_id',
                                as: "taskDetails"
                            }
                        },
                        {
                            $unwind: { path: "$taskDetails" }
                        },
                        {
                            $sort: {
                                createdAt: -1
                            }
                        },
                        {
                            $skip: skip
                        },
                        {
                            $limit: limit
                        },
                        {
                            $project: {
                                _id: 1,
                                reviewerName: "$reviewerDetails.name",
                                taskTitle: "$taskDetails.title",
                                createdAt: 1,
                                review: 1,
                                rating: 1
                            }
                        }

                    ],
                    totalReviews: [
                        {
                            $count: "TotalReviews"
                        }
                    ],
                    ratingCount: [
                        {
                            $match: { reviewee: isUser._id }
                        },
                        {
                            $group: {
                                _id: "$rating",
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $sort: {
                                _id: -1
                            }
                        }
                    ]
                }
            }
        ])
        // console.log(reviewDatas[0]);
        const responseReviews = {
            reviews: reviewDatas[0].reviews,
            totalReviews: reviewDatas[0].totalReviews[0].TotalReviews,
            ratingCount: reviewDatas[0].ratingCount,
        }
        responseReviews.totalPages = Math.ceil(responseReviews.totalReviews / limit);
        responseReviews.overallRating = isUser.worker.rating.toFixed(1);
        console.log(responseReviews);
        return { success: true, reviews: responseReviews, message: 'fetched reviews Successfully' }

    } catch (error) {
        console.log(error);
        return { error: MESSAGES.UNEXPECTED_ERROR }
    }
}

export const getEarningHeroDataService = async ({ userId }) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    try {
        const isUser = await User.findOne({ _id: userId })
        if (!isUser) {
            return { error: MESSAGES.USER_NOT_FOUND }
        }
        const earningsData = await Wallet.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                }
            },
            {
                $lookup: {
                    from: "transactions",
                    let: { workerId: "$userId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$receiverId", "$$workerId"] },
                                        { $eq: ["$transactionType", "to_worker_wallet"] },
                                        { $eq: ["$status", "completed"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "successTransactions"
                }
            },

            {
                $addFields: {
                    highestPaidAmount: {
                        $ifNull: [{ $max: "$successTransactions.amount" }, 0]
                    },

                    last7DayEarning: {
                        $filter: {
                            input: "$successTransactions",
                            as: "tran",
                            cond: {
                                $gte: ["$$tran.createdAt", sevenDaysAgo]
                            }
                        }
                    }
                }
            },

            {
                $addFields: {
                    earnedLast7Days: {
                        $ifNull: [{ $sum: "$last7DayEarning.amount" }, 0]
                    }
                }
            },

            {
                $lookup: {
                    from: "tasks",
                    localField: "userId",
                    foreignField: "workerId",
                    as: "tasks",
                    pipeline: [
                        {
                            $match: {
                                status: "completed",
                                update: "payment"
                            }
                        }
                    ]
                }
            },

            {
                $addFields: {
                    completedTasks: {
                        $ifNull: [{ $size: "$tasks" }, 0]
                    },

                }
            },

            {
                $project: {
                    walletAmount: 1,
                    withDrawn: 1,
                    highestPaidAmount: 1,
                    earnedLast7Days: 1,
                    completedTasks: 1,
                    totalEarned: 1,
                }
            }

        ]);

        const heroData = earningsData[0] || {
            walletAmount: 0,
            withDrawn: 0,
            highestPaidAmount: 0,
            earnedLast7Days: 0,
            completedTasks: 0,
            totalEarned: 0,
        };

        heroData.averageAmount = heroData.completedTasks > 0
            ? Math.round(heroData.totalEarned / heroData.completedTasks)
            : 0;

        heroData.sinceDate = isUser.createdAt
            ? new Date(isUser.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
            : "";

        return { success: true, message: "Earnings data fetched successfully", earningsData: heroData };

    } catch (error) {
        console.log(error);
        return { error: MESSAGES.UNEXPECTED_ERROR }
    }
}

export const getTransactionHistoryService = async ({ userId, page, limit }) => {
    const skip = (page - 1) * limit;
    console.log("userId", userId);
    try {
        const isUser = await User.findOne({ _id: userId })
        if (!isUser) {
            return { error: MESSAGES.USER_NOT_FOUND }
        }

        const transactions = await Transaction.find({ receiverId: new mongoose.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalTransactions = await Transaction.countDocuments({ receiverId: new mongoose.Types.ObjectId(userId) })
        const totalPages = Math.ceil(totalTransactions / limit)
        const transactionsData = transactions.map((transaction) => {
            return {
                _id: transaction._id,
                amount: transaction.amount,
                transactionType: transaction.transactionType,
                status: transaction.status,
                processedAt: transaction.processedAt,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,

            }
        })
        return {
            success: true,
            message: "Transactions fetched successfully",
            transactionsData,
            pagination: {
                page,
                limit,
                totalPages,
                totalTransactions,
            }
        };
    } catch (error) {
        console.log(error);
        return { error: MESSAGES.UNEXPECTED_ERROR }
    }
}