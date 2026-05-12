import express from "express";
import upload from "../middlewares/upload.js";
import { workerSignup } from "../controller/WorkerControllers/workerController.js";
import { getOtpForSignUp, posterSignup, refreshAccessToken, verifySignUpOtp } from "../controller/authController.js";

const router = express.Router();

router.post("/signup/poster", posterSignup);

router.post("/signup/worker", upload.fields([{ name: 'idFront' }, { name: 'idBack' }, { name: 'selfie' }]), workerSignup);

router.post("/refresh-token", refreshAccessToken);

router.post("/get-otp", getOtpForSignUp)

router.post("/verify-otp", verifySignUpOtp);

export default router;