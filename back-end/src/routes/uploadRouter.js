import express from "express";
import {
    getPresignedUrlController,
    directS3ProxyFallbackController,
} from "../controller/uploadController.js";
import upload from "../middlewares/upload.js";

const uploadRouter = express.Router();

// Generate a single presigned URL for direct S3 upload
uploadRouter.post("/presign", getPresignedUrlController);

// Fallback upload proxy in case direct client-side S3 PUT is blocked by CORS
uploadRouter.post("/fallback", upload.single("file"), directS3ProxyFallbackController);

export default uploadRouter;
