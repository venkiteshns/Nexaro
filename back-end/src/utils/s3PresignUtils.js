import path from "path";
import { randomUUID } from "crypto";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";

// Multipurpose Internet Mail Extensions (MIME) types
const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
    "image/svg+xml",
    "application/pdf",
]);

// Sanitize a filename to avoid problematic characters in S3 keys.
const sanitizeFileName = (fileName) => {
    return fileName
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .toLowerCase();
};

// Generate a single S3 Presigned Upload (PUT) URL.
export const generatePresignedUploadUrl = async ({
    fileName = "file",
    fileType,
    folder = "uploads",
    expiresIn = 300, // 5 minutes
}) => {
    if (!fileType || !ALLOWED_MIME_TYPES.has(fileType.toLowerCase())) {
        throw new Error(
            `Unsupported file type: ${fileType}. Allowed types: ${Array.from(ALLOWED_MIME_TYPES).join(", ")}`
        );
    }

    const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
    const ext = path.extname(fileName) || "";
    const baseName = sanitizeFileName(path.basename(fileName, ext));
    const uniqueFileName = `${randomUUID()}-${baseName}${ext}`;
    const key = `Nexaro/${cleanFolder}/${uniqueFileName}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn });
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return {
        uploadUrl,
        fileUrl,
        key,
        format: fileType,
        expiresIn,
    };
};

/**
 * Generate an S3 Presigned GET URL for viewing or downloading private files.
 */
export const generatePresignedGetUrl = async (key, expiresIn = 3600) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
    });

    return await getSignedUrl(s3, command, { expiresIn });
};
