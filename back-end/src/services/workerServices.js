import User from "../models/userSchema.js";
import { hashData } from "../utils/hasing.js";
import { uploadManyFiles } from "../utils/uploadUtils.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import MESSAGES from "../constants/messages.js";
import mongoose from "mongoose";

export const workerSignupService = async ({ files, data }) => {

    try {
        const user = await User.findOne({ email: data.email })

        if (user) {
            throw new Error(MESSAGES.USER_NOT_EXIST_WITH_EMAIL)
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
        try { parsedLanguages = typeof data.language === 'string' ? JSON.parse(data.language) : data.language; } catch(e) { console.log("Parse error", e);
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
        return { error: error.message ||  MESSAGES.UNEXPECTED_ERROR };
    }
}

export const getWorkerProfileService = async (user) => {
    
    // 1 Check the user object
    if(!user){
        return {error: MESSAGES.USER_NOT_FOUND}
    }

    try {

        // 2 Check if user exists in database

        const isUserExist = await User.findById(user._id)
        if(!isUserExist) {
           return {error: MESSAGES.USER_NOT_FOUND}
        }  

        // 3 Prepare response 
        const userData = await User.aggregate([
            {
                $match: {_id: new mongoose.Types.ObjectId(user._id)}
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
                    jobsCompleted: {$size:{ $ifNull : [ "$jobs", [] ]}}
                }
            },
            {
                $lookup: {
                    from: 'reviews',
                    let: {userId: '$_id'},
                    pipeline: [
                        {
                            $match: {
                                $expr: {$eq: ["$reviewee", "$$userId"]}
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
                                        $unwind:{
                                            path: "$reviewerData"
                                        }
                                    },
                                    {
                                        $project: {
                                            review:1,
                                            rating: 1,
                                            "reviewerData.name" :1,
                                            "reviewerData.avatar": "$reviewerData.verificationDocuments.selfie.url"
                                        }
                                    },
                                    {
                                        $sort: {createdAt: -1}
                                    },
                                    {
                                        $limit: 2
                                    }
                                ],
                                topRating: [
                                    {
                                        $sort: {rating: -1}
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
                    from: "wallet",
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'wallet'
                }
            },
            {
                $project: {
                    _id:1,
                    name: 1,
                    avatar: { $ifNull: ['$verificationDocuments.selfie.url', process.env.DEFAULT_AVATAR_URL] },
                    worker:1,
                    jobsCompleted:1,
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
                                $first: {$arrayElemAt: ["$reviews.topRating.rating", 0]}
                            }, 0
                        ]
                    },
                    wallet:1,
                    bio:1,
                    languages:1,
                    skills:1,
                    "address": {
                        $concat: ["$city",", ", "$district"]
                    },
                    isVerified: 1,
                    phone:1,
                    email:1,
                }
            }
        ]);
        console.log(userData[0]);
        
        return {success: true, profileData: userData[0]}
        
    } catch (error) {
        console.log("Worker profile service error ",error);
        return {error: error.message || MESSAGES.UNEXPECTED_ERROR}
    }
}

export const updateWorkerProfileService = async ({user, data, avatar}) => {
   console.log(user);
   
    // 1 Check Form Values
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!user){
        return {unauthorized: MESSAGES.UNAUTHORIZED_USER}
    }
    if(!data.email){
        return {error:MESSAGES.EMAIL_REQUIRED}
    }
    if(!emailRegex.test(data.email)){
        return {error: MESSAGES.INVALID_EMAIL}
    }
    if(!data.phone){
        return {error:MESSAGES.PHONE_REQUIRED}
    }
    if(!data.bio){
        return {error : "Bio is required"}
    }
    if(!data.skills){
       return {error: "Please enter atleast one skill"}
    }
    if(!data.languages){
       return {error: "Please enter atleast one language"}
    }
    try {
        const parsedLanguages = JSON.parse(data.languages)
        const parsedSkills = JSON.parse(data.skills)
        const isEmailExist = await User.findOne({_id :{$ne: new mongoose.Types.ObjectId(user._id)}, email:data.email});
        if(isEmailExist){
            return {error: MESSAGES.EMAIL_ALREADY_IN_USE};
        }
        const isPhoneExist = await User.findOne({_id :{$ne: new mongoose.Types.ObjectId(user._id)}, phone:data.phone});
        if(isPhoneExist){
            return {error: MESSAGES.PHONE_ALREADY_IN_USE};
        }
        const userData = await User.findOne({_id: new mongoose.Types.ObjectId(user._id), activeRole:"worker"})      
        if(!userData){
            return {error: MESSAGES.USER_NOT_FOUND}
        }  
        if(avatar && Array.isArray(avatar?.avatar) && avatar?.avatar.length > 0) {
            // upload avatar
            const uploadStatus = await uploadManyFiles(avatar, `user/${data.email}/verification`);
            if(uploadStatus.error) {
                return {error: "Unable to upload profile picture, Please try again."}
            }
            userData.verificationDocuments.selfie = uploadStatus.avatar;
        }
        userData.email = data.email;
        userData.phone = data.phone;
        userData.bio = data.bio;
        userData.skills = parsedSkills;
        userData.languages = parsedLanguages;

        await userData.save()

        return {success: true, message: MESSAGES.USER_PROFILE_UPDATED}
    } catch (error) {
        console.error("Worker profile update service error ", error);
        return {error: "Unexpected error occoured"}
    }
}

export const switchRoleToPosterService = async ({user}) => {
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