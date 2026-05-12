import User from "../models/userSchema.js";
import { hashData } from "../utils/hasing.js";

export const posterSignupService = async (data) => {
    console.log(data);

    try {
        // 1. Duplicate check
        const existing = await User.findOne({ email: data.email });
        if (existing) {
            throw new Error("User Already Exists");
        }

        // 2. Parse coordinates — must be finite numbers for 2dsphere index
        const locationLat = parseFloat(data.locationLat);
        const locationLng = parseFloat(data.locationLng);
        const hasValidLocation = isFinite(locationLat) && isFinite(locationLng);

        // 3. Hash password
        const hashedPassword = await hashData(data.password);

        // 4. Build clean payload (no frontend-only fields)
        const payload = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            country: data.country,
            state: data.state,
            district: data.district,
            city: data.city,
            isVerified: false,
            isDeleted: false,
            isSuspended: false,
            activeRole: "poster"
        };

        // 5. Attach GeoJSON location only when coordinates are valid
        if (hasValidLocation) {
            payload.location = {
                type: "Point",
                coordinates: [locationLng, locationLat], // GeoJSON: [lng, lat]
            };
        }

        // 6. Create user
        const createdUser = await User.create(payload);

        // 7. Generate tokens
        const accessToken = createdUser.generateAccessToken();
        const refreshToken = createdUser.generateRefreshToken();

        createdUser.refreshToken = refreshToken;
        await createdUser.save({ validateBeforeSave: false });

        const { _id, name, email, activeRole } = createdUser;
        const responseUser = { id: _id, name, email, role: activeRole };

        return { responseUser, accessToken, refreshToken };

    } catch (error) {
        console.error("posterSignupService error:", error.message);
        return { error: error.message };
    }
};