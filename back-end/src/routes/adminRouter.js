import express from "express";
import {
    getAllUsers,
    suspendUser,
    unsuspendUser,
    getPendingVerificationUsers,
    approveUser,
    rejectUser,
    getAllTasks,
    cancelTaskByAdmin,
    getAdminTaskDetails,
    getAdminFinanceStats,
    getAdminFinanceChart,
    getAdminFinanceTransactions,
    getAdminDailyRevenueReport,
    getAdminMonthlyPlReport,
    getAdminPlatformFeeSummary,
    getAdminNotifications,
    markAllAdminNotificationsRead,
    markAdminNotificationRead,
    sendAdminAnnouncement,
    getAdminRecentAnnouncements,
    getAdminDashboard,
} from "../controller/AdminControllers/adminController.js";
import verifyToken from "../middlewares/verifyToken.js";

const adminRouter = express.Router();

adminRouter.use(verifyToken);

adminRouter.get("/dashboard", getAdminDashboard);
adminRouter.get("/users", getAllUsers);
adminRouter.get("/tasks", getAllTasks);
adminRouter.get("/users/pending-verification", getPendingVerificationUsers);

adminRouter.patch("/users/:userId/suspend", suspendUser);
adminRouter.patch("/users/:userId/unsuspend", unsuspendUser);
adminRouter.patch("/users/:userId/approve", approveUser);
adminRouter.patch("/users/:userId/reject", rejectUser);

adminRouter.patch('/task/cancel/:taskId', cancelTaskByAdmin);
adminRouter.get('/task/:taskId', getAdminTaskDetails);

adminRouter.get("/finance/stats", getAdminFinanceStats);
adminRouter.get("/finance/chart", getAdminFinanceChart);
adminRouter.get("/finance/transactions", getAdminFinanceTransactions);
adminRouter.get("/finance/reports/daily", getAdminDailyRevenueReport);
adminRouter.get("/finance/reports/monthly", getAdminMonthlyPlReport);
adminRouter.get("/finance/reports/platform-fee", getAdminPlatformFeeSummary);

adminRouter.get("/notifications", getAdminNotifications);
adminRouter.patch("/notifications/mark-all-read", markAllAdminNotificationsRead);
adminRouter.patch("/notifications/:id/read", markAdminNotificationRead);
adminRouter.post("/announcements", sendAdminAnnouncement);
adminRouter.get("/announcements/recent", getAdminRecentAnnouncements);

export default adminRouter;

