import express from "express";
import upload from "../middlewares/upload.js";
import { workerSignup } from "../controller/WorkerControllers/workerController.js";
import { refreshAccessToken } from "../controller/authController.js";

const router = express.Router();

router.post("/signup/poster", (req, res) => {
    console.log(req.body);
    return res.status(200).json({ success: true, message: "Signup Sucessfull" })
});

router.post("/signup/worker", upload.fields([{ name: 'idFront' }, { name: 'idBack' }, { name: 'selfie' }]), workerSignup);

router.post("/refresh-token", refreshAccessToken);

export default router;