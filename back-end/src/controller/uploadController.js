import {
    generatePresignedUploadUrl,
} from "../utils/s3PresignUtils.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";
import logger from "../utils/logger.js";
import STATUS_CODES from "../constants/statusCodes.js";
import MESSAGES from "../constants/messages.js";

/**
 * Controller to generate a single S3 Presigned Upload URL.
 */
export const getPresignedUrlController = async (req, res) => {
    try {
        const { fileName, fileType, folder = "uploads" } = req.body;

        if (!fileName || !fileType) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.FILE_NAME_AND_TYPE_REQUIRED,
            });
        }

        const data = await generatePresignedUploadUrl({
            fileName,
            fileType,
            folder,
        });

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.PRESIGNED_URL_GENERATED,
            data,
        });
    } catch (error) {
        logger.error("Error generating presigned URL:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || MESSAGES.FAILED_TO_GENERATE_PRESIGNED_URL,
        });
    }
};

/**
 * Fallback controller: directly uploads a file to S3 via backend stream
 * in case direct browser PUT fails (e.g., if S3 CORS is pending).
 */
export const directS3ProxyFallbackController = async (req, res) => {
    try {
        const file = req.file;
        const folder = req.body.folder || "uploads";

        if (!file) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.NO_FILE_PROVIDED,
            });
        }

        const ext = path.extname(file.originalname) || "";
        const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9.-]/g, "_");
        const key = `Nexaro/${folder.replace(/^\/+|\/+$/g, "")}/${randomUUID()}-${cleanName}${ext}`;

        const bodyStream = file.path ? fs.createReadStream(file.path) : file.buffer;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: bodyStream,
            ContentType: file.mimetype,
        });

        await s3.send(command);

        if (file.path) {
            await fs.promises.unlink(file.path).catch(() => {});
        }

        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.FILE_UPLOAD_SUCCESS,
            data: {
                url: fileUrl,
                key,
                format: file.mimetype,
            },
        });
    } catch (error) {
        logger.error("Error in fallback S3 upload:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || MESSAGES.FAILED_TO_UPLOAD_FILE,
        });
    }
};
