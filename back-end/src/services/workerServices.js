import User from "../models/userSchema.js";
import { uploadManyFiles } from "../utils/uploadUtils.js";

export const workerSignupService = async ({ files, data }) => {

    try {
        let user = await User.findOne({ email: data.email })

        if (user) {
            throw new Error("User Already Exists")
        }

        let payLoad = {
            name: data.fullName,
            email: data.email,
            phone: data.phone,
            password: data.password,
            country: data.country,
            state: data.state,
            district: data.district,
            city: data.city,
            serviceArea: {
                area: data.serviceArea,
                type: 'Point',
                coordinates: [data.serviceAreaLng, data.serviceAreaLat]
            },
            bio: data.bio,
            verificationDocuments: {
                idType: data.idType
            },
            skills: data.skills,
            languages: data.languages,
            isVerified: false,
            isDeleted: false,
            isSuspended: false,
            role: "worker",
            activeRole: "worker",
            location: {
                type: "Point",
                coordinates: [data.locationLng, data.locationLat]
            },
            worker: {
                isLive: false,
                rating: "0"
            }
        }
        const uploadStatus = await uploadManyFiles(files, `user/${payLoad.email}/verification`);

        if (uploadStatus.error) {
            throw new Error("Error in Uploading Files")
        }

        payLoad.verificationDocuments.selfie = uploadStatus.selfie;
        payLoad.verificationDocuments.idFront = uploadStatus.idFront;
        payLoad.verificationDocuments.idBack = uploadStatus.idBack;

        const createdUser = await User.create(payLoad);

        const accessToken = createdUser.generateAccessToken();
        const refreshToken = createdUser.generateRefreshToken();

        createdUser.refreshToken = refreshToken;
        await createdUser.save({ validateBeforeSave: false });
        const { _id, name, email, verificationDocuments } = createdUser;
        const responseUser = { id: _id, name, email, selfie: verificationDocuments.selfie.url };
        console.log(responseUser);
        return { responseUser, accessToken, refreshToken };


    } catch (error) {
        console.log(error)
        return { error: error.message };
    }


}