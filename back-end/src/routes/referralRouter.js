import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  getReferralStats,
  validateReferralCode,
} from "../controller/referralController.js";

const router = express.Router();

// Public validation endpoint for registration forms
router.get("/validate/:code", validateReferralCode);

// Authenticated endpoints for user referral dashboard
router.get("/stats", verifyToken, getReferralStats);

export default router;
