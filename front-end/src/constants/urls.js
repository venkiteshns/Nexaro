// Auth
export const AUTH = {
    SEND_OTP: "/auth/get-otp",
    VERIFY_OTP:"/auth/verify-otp",
    POSTER_SIGNUP:"/auth/signup/poster",
    WORKER_SIGNUP:"/auth/signup/worker",
    USER_LOGIN:"/auth/login",
    GOOGLE_LOGIN:"/auth/google-login",
    ADMIN_LOGIN:"/auth/login/admin",
    USER_LOGOUT:"/auth/logout",
    ADMIN_LOGOUT:"/auth/logout/",
    FORGOT_PASSWORD:"/auth/forgot-password",
    UPDATE_PASSWORD:"/auth/update-password",
}

export const POSTER = {
    CREATE_TASK: "/poster/tasks/create",
    GET_TASKS: "/poster/tasks",
    CANCEL_TASK: "/poster/task/cancel/:taskId",
    UPDATE_TASK: "/poster/task/update/:taskId",
    GET_BIDS: "/poster/task/bids/:taskId",
    ACCEPT_BID: "/poster/bid/accept/:bidId",
    TASK_PROGRESS: "/poster/task/:taskId/progress",
    COMPLETED_TASK: "/poster/task/completed/:taskId",
    PROFILE: "/poster/profile",
    UPDATE_PROFILE: "/poster/profile/update",
}

export const WORKER = {
    GET_TASKS: "/worker/tasks/nearby",
    GET_TASK_FOR_BID: "/worker/task/:taskId",
    ADD_BID: "/worker/tasks/add_bid",
    GET_WORKER_BIDS: "/worker/my-bids",
    GET_BID_DETAILS: "/worker/bid-details/:bidId",
    WITHDRAW_BID: "/worker/bid/withdraw/:bidId",
    GET_ACTIVE_JOB: "/worker/task/:taskId/active-job",
    UPDATE_JOB_PROGRESS: "/worker/task/:taskId/progress",
}