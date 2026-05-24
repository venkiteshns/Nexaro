import express from "express";
import {
    getAllUsers,
    suspendUser,
    unsuspendUser,
    getPendingVerificationUsers,
    approveUser,
    rejectUser
} from "../controller/AdminControllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/users", getAllUsers);
adminRouter.get("/users/pending-verification", getPendingVerificationUsers);

adminRouter.patch("/users/:userId/suspend", suspendUser);
adminRouter.patch("/users/:userId/unsuspend", unsuspendUser);
adminRouter.patch("/users/:userId/approve", approveUser);
adminRouter.patch("/users/:userId/reject", rejectUser);

export default adminRouter;
