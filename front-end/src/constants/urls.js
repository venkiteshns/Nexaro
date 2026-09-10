export const AUTH = {
    SEND_OTP: "/auth/get-otp",
    VERIFY_OTP: "/auth/verify-otp",
    POSTER_SIGNUP: "/auth/signup/poster",
    WORKER_SIGNUP: "/auth/signup/worker",
    USER_LOGIN: "/auth/login",
    GOOGLE_LOGIN: "/auth/google-login",
    ADMIN_LOGIN: "/auth/login/admin",
    USER_LOGOUT: "/auth/logout",
    ADMIN_LOGOUT: "/auth/logout/",
    FORGOT_PASSWORD: "/auth/forgot-password",
    UPDATE_PASSWORD: "/auth/update-password",
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
    ROLE_SWITCH: "/poster/switch/role",
    ROLE_SWITCH_ACTIVE_WORKER: '/poster/switch/to_worker',
    GET_NOTIFICATIONS: "/poster/notifications",
    GET_UNREAD_COUNT: "/poster/notifications/unread-count",
    MARK_ALL_NOTIFICATIONS_READ: "/poster/notifications/mark-all-read",
    MARK_NOTIFICATION_READ: "/poster/notifications/:id/read",
}

export const WORKER = {
    GET_TASKS: "/worker/tasks/nearby",
    GET_TASK_FOR_BID: "/worker/task/:taskId",
    ADD_BID: "/worker/tasks/add_bid",
    GET_WORKER_BIDS: "/worker/my-bids",
    GET_WORKER_PROFILE: '/worker/profile',
    GET_BID_DETAILS: "/worker/bid-details/:bidId",
    WITHDRAW_BID: "/worker/bid/withdraw/:bidId",
    GET_CURRENT_ACTIVE_JOB: "/worker/active-job",
    GET_ACTIVE_JOB: "/worker/task/:taskId/active-job",
    UPDATE_JOB_PROGRESS: "/worker/task/:taskId/progress",
    UPDATE_PROFILE: "/worker/profile/update",
    SWITCH_ROLE: '/worker/switch/role',
    GET_REVIEWS: "/worker/reviews",
    COMPLETED_TASK: "/worker/task/:taskId/completed",
    GET_EARNING_HERO_DATA: "/worker/earnings/hero",
    GET_TRANSACTION_HISTORY: "/worker/earnings/transactions",
    GET_EARNING_CHART: "/worker/earnings/chart",
    WITHDRAW_EARNINGS: "/worker/earnings/withdraw",
    GET_NOTIFICATIONS: "/worker/notifications",
    GET_UNREAD_COUNT: "/worker/notifications/unread-count",
    MARK_ALL_NOTIFICATIONS_READ: "/worker/notifications/mark-all-read",
    MARK_NOTIFICATION_READ: "/worker/notifications/:id/read",
    GET_HEADER_STATUS: "/worker/status/header",
    TOGGLE_LIVE_STATUS: "/worker/status/live",
}

export const PAYMENT = {
    CREATE_ORDER: `${import.meta.env.VITE_API_URL}/payment/orders`,
    CAPTURE_PAYMENT: `${import.meta.env.VITE_API_URL}/payment/orders/:orderId/capture`,
    PAYOUT: `${import.meta.env.VITE_API_URL}/payment/orders/:bidId/payout`
}

export const REVIEWS = {
    CREATE_REVIEW: "/poster/review",
};

export const ADMIN = {
    GET_USERS: "/admin/users",
    GET_PENDING_VERIFICATION_USERS: "/admin/users/pending-verification",
    SUSPEND_USER: "/admin/users/:userId/suspend",
    UNSUSPEND_USER: "/admin/users/:userId/unsuspend",
    APPROVE_USER: "/admin/users/:userId/approve",
    REJECT_USER: "/admin/users/:userId/reject",
    GET_TASKS: "/admin/tasks",
    DELETE_TASK: "/admin/task/cancel/:taskId",
    GET_TASK_DETAILS: "/admin/task/:taskId",
    GET_FINANCE_STATS: "/admin/finance/stats",
    GET_FINANCE_CHART: "/admin/finance/chart",
    GET_FINANCE_TRANSACTIONS: "/admin/finance/transactions",
    GET_DAILY_REPORT: "/admin/finance/reports/daily",
    GET_MONTHLY_PL_REPORT: "/admin/finance/reports/monthly",
    GET_PLATFORM_FEE_SUMMARY: "/admin/finance/reports/platform-fee",
    GET_NOTIFICATIONS: "/admin/notifications",
    MARK_ALL_NOTIFICATIONS_READ: "/admin/notifications/mark-all-read",
    MARK_NOTIFICATION_READ: "/admin/notifications/:id/read",
    SEND_ANNOUNCEMENT: "/admin/announcements",
    GET_RECENT_ANNOUNCEMENTS: "/admin/announcements/recent",
    GET_DASHBOARD: "/admin/dashboard",
};

export const SHARED = {
    UPDATE_PROFILE_PASSWORD: "/auth/profile/update-password",
    DELETE_PROFILE: "/auth/profile/delete",
};

