import express from "express";
import { getAllUsers } from "../controller/AdminControllers/adminController.js";

const adminRouter = express.Router();

// GET /api/admin/users?page=1&limit=10
adminRouter.get("/users", getAllUsers);

export default adminRouter;
