import express from "express";
import upload from "../middlewares/upload.js";
import { workerSignup } from "../controller/WorkerControllers/workerController.js";
import { posterSignup } from "../controller/PosterControllers/posterController.js";
import { getOtpForSignUp, login, logout, refreshAccessToken, verifySignUpOtp, forgotPasswordOtp, updatePassword, googleLogin } from "../controller/authController.js";

const router = express.Router();

router.post("/signup/poster", posterSignup);

router.post("/signup/worker", upload.fields([{ name: 'id_front' }, { name: 'id_back' }, { name: 'selfie' }]), workerSignup);

router.post('/login/:admin', login);

router.post("/refresh-token", refreshAccessToken);

router.post("/get-otp", getOtpForSignUp);

router.post("/verify-otp", verifySignUpOtp);

router.post("/login", login);

router.post("/logout", logout);

router.post("/forgot-password/:role", forgotPasswordOtp);

router.post("/update-password", updatePassword);

router.post("/google-login", googleLogin);

export default router;