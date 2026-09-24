import {
    generatePresignedUploadUrl,
    generatePresignedUploadUrls,
} from "../utils/s3PresignUtils.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";

/**
 * Controller to generate a single S3 Presigned Upload URL.
 */
export const getPresignedUrlController = async (req, res) => {
    try {
        const { fileName, fileType, folder = "uploads" } = req.body;

        if (!fileName || !fileType) {
            return res.status(400).json({
                success: false,
                message: "fileName and fileType are required.",
            });
        }

        const data = await generatePresignedUploadUrl({
            fileName,
            fileType,
            folder,
        });

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to generate presigned URL.",
        });
    }
};

/**
 * Controller to generate multiple S3 Presigned Upload URLs in batch.
 */
export const getPresignedUrlsBatchController = async (req, res) => {
    try {
        const { files, folder = "uploads" } = req.body;

        if (!Array.isArray(files) || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "files array is required.",
            });
        }

        const data = await generatePresignedUploadUrls(files, folder);

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Error generating batch presigned URLs:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to generate batch presigned URLs.",
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
            return res.status(400).json({
                success: false,
                message: "No file provided for upload.",
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

        return res.status(200).json({
            success: true,
            data: {
                url: fileUrl,
                key,
                format: file.mimetype,
            },
        });
    } catch (error) {
        console.error("Error in fallback S3 upload:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to upload file to S3.",
        });
    }
};
