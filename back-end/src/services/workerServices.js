import User from "../models/userSchema.js";
import { hashData } from "../utils/hasing.js";
import { uploadManyFiles } from "../utils/uploadUtils.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

export const workerSignupService = async ({ files, data }) => {

    try {
        let user = await User.findOne({ email: data.email })

        if (user) {
            throw new Error("User Already Exists")
        }

        const locationLat = parseFloat(data.locationLat);
        const locationLng = parseFloat(data.locationLng);
        const hasValidLocation = isFinite(locationLat) && isFinite(locationLng);

        const serviceAreaLat = parseFloat(data.workPlacelat);
        const serviceAreaLng = parseFloat(data.workPlacelng);
        const hasValidServiceArea = isFinite(serviceAreaLat) && isFinite(serviceAreaLng);

        let parsedSkills = [];
        let parsedLanguages = [];
        try { parsedSkills = typeof data.skills === 'string' ? JSON.parse(data.skills) : data.skills; } catch (e) { }
        try { parsedLanguages = typeof data.languages === 'string' ? JSON.parse(data.languages) : data.languages; } catch (e) { }

        const hashedPassword = await hashData(data.password);

        let payLoad = {
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
                area: data.serviceArea,
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

        const createdUser = await User.create(payLoad);

        const accessToken = generateAccessToken(createdUser);
        const refreshToken = generateRefreshToken(createdUser);

        createdUser.refreshToken = refreshToken;
        await createdUser.save({ validateBeforeSave: false });
        const { _id, name, email, verificationDocuments, activeRole } = createdUser;
        const responseUser = { id: _id, name, email, selfie: verificationDocuments.selfie.url, role: activeRole };
        console.log(responseUser);
        return { responseUser, accessToken, refreshToken };


    } catch (error) {
        console.log(error)
        return { error: "User with same credentials exists, Try with different mobile number" };
    }
}
