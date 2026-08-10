
const MESSAGES = {

    INTERNAL_SERVER_ERROR: "Internal server error",
    UNEXPECTED_ERROR: 'Unexpected Error Occoured Please Try again later!',
    INVALID_PAGE_OR_LIMIT: "Invalid page or limit value",
    FAILED_TO_FETCH_USERS: "Failed to fetch users",
    USER_ID_REQUIRED: "User ID is required",

    OTP_SENT: "OTP sent successfully",
    OTP_VERIFIED: "OTP verified successfully",

    LOGIN_SUCCESS: "Login successful",
    LOGGED_OUT: "Logged out successfully",
    REFRESH_TOKEN_REQUIRED: "Invalid Access Token - Refresh token is required",
    INVALID_REFRESH_TOKEN: "Invalid or expired refresh token",

    FAILED_TO_SEND_OTP: "Failed to send OTP",

    INVALID_ADMIN_CREDENTIALS: "Invalid admin credentials",
    RESET_OTP_SENT: "Password reset OTP sent successfully",
    INVALID_PASSWORD: "Invalid password",
    INVALID_OTP: "Invalid or expired OTP",

    EMAIL_REQUIRED: "Email is required",

    EMAIL_AND_PASSWORD_REQUIRED: "Email and password are required",

    USER_NOT_FOUND: "User not found",
    USER_ALREADY_SUSPENDED: "User is already suspended",
    USER_SUSPENDED: "User suspended successfully",
    USER_NOT_SUSPENDED: "User is not suspended",
    USER_UNSUSPENDED: "User unsuspended successfully",

    USER_NOT_EXIST_WITH_EMAIL: "User does not exist with this email",
    USER_NOT_EXIST_WITH_EMAIL_MOBILE: "User does not exist with this email or mobile number",

    USER_ALREADY_VERIFIED: "User is already verified",
    USER_APPROVED: "User approved successfully",
    USER_REJECTED: "User rejected and account suspended",

    ACCESS_RESTRICTED_ADMIN: "Access restricted to admins only",

    WORKER_REGISTERED: "Worker registered successfully",
    NEARBY_TASKS_FETCHED: "Nearby tasks fetched successfully",
    TASK_FETCHED: "Task fetched successfully",
    SERVICE_AREA_NOT_SET: "Worker service area location is not set. Please update your profile.",

    POSTER_REGISTERED: "Poster registered successfully",
    TASK_CREATED: "Task created successfully",
    TASKS_FETCHED: "Tasks fetched successfully",
    TASK_ID_REQUIRED: "Task ID is required",
    TASK_NOT_FOUND: "Task not found",
    TASK_CANCELLED: "Task cancelled successfully",
    FAILED_TO_FETCH_TASKS: "Failed to fetch tasks",
    GOOGLE_TOKEN_REQUIRED: "Google token is required",

    USER_PROFILE_UPDATED: "User profile updated successfully",
    PROFILE_FETCH_SUCCESS: "User profile fetched successfully",
    PASSWORD_UPDATED: "Password updated successfully",
    PASSWORD_UPDATE_FAILED: "Failed to update password",
    PROFILE_DELETED: "Profile deleted successfully",
    PROFILE_DELETE_FAILED: "Failed to delete profile",

    INVALID_CREDENTIALS: "Invalid email or password",
    EMAIL_ALREADY_IN_USE: "Email already in use by another user",
    PHONE_ALREADY_IN_USE: "Phone number already in use by another user",

    AMOUNT_MISMATCH:  "Amount mismatch",

    REVIEW_SUBMITTED: "Review submitted successfully",
    REVIEW_ALREADY_EXISTS: "You have already submitted a review for this task",
    TASK_NOT_ELIGIBLE_FOR_REVIEW: "This task is not eligible for a review. Payment must be released first.",
    UNAUTHORIZED_REVIEWER: "You are not authorized to review this task",
    INVALID_RATING: "Rating must be a number between 1 and 5",
    REVIEW_TOO_SHORT: "Review must be at least 10 characters",
    REVIEW_TOO_LONG: "Review must not exceed 1000 characters",
    REVIEWEE_MISMATCH: "The reviewee does not match the worker assigned to this task",
    REVIEW_REQUIRED: "Review text is required",

};

export default MESSAGES;
