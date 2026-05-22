import express from "express";
import upload from "../middlewares/upload.js";
import { workerSignup } from "../controller/WorkerControllers/workerController.js";
import { posterSignup } from "../controller/PosterControllers/posterController.js";
import { getOtpForSignUp, login, logout, refreshAccessToken, verifySignUpOtp } from "../controller/authController.js";

const router = express.Router();

router.post("/signup/poster", posterSignup);

router.post("/signup/worker", upload.fields([{ name: 'id_front' }, { name: 'id_back' }, { name: 'selfie' }]), workerSignup);

router.post("/refresh-token", refreshAccessToken);

router.post("/get-otp", getOtpForSignUp)

router.post("/verify-otp", verifySignUpOtp);

router.post("/login", login);

router.post("/logout", logout);

export default router;