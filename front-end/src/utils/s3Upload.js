// uploading files directly to AWS S3 using Presigned Signed URLs.

const getApiBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
        return envUrl.replace(/\/+$/, "");
    }
    return "http://localhost:8000/api";
};

export const uploadFileToS3 = async (file, folder = "uploads") => {
    if (!file) {
        throw new Error("No file provided for upload");
    }

    const apiUrl = getApiBaseUrl();

    // 1. Request presigned URL from backend
    let presignedData;
    try {
        const presignRes = await fetch(`${apiUrl}/upload/presign`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fileName: file.name || "file",
                fileType: file.type || "application/octet-stream",
                folder,
            }),
        });

        const presignJson = await presignRes.json();
        if (presignJson.success && presignJson.data) {
            presignedData = presignJson.data;
        } else {
            throw new Error(presignJson.message || "Failed to get S3 presigned URL");
        }
    } catch (err) {
        console.warn("Failed to obtain presigned URL, falling back to server upload:", err);
        return uploadFallback(file, folder);
    }

    // 2. Direct upload to S3 via PUT request
    try {
        const s3Response = await fetch(presignedData.uploadUrl, {
            method: "PUT",
            headers: {
                "Content-Type": file.type || "application/octet-stream",
            },
            body: file,
        });

        if (!s3Response.ok) {
            throw new Error(
                `S3 upload failed with status ${s3Response.status}`
            );
        }
        return {
            url: presignedData.fileUrl,
            key: presignedData.key,
            format: presignedData.format,
        };
    } catch (s3Error) {
        console.warn("Direct S3 PUT failed (likely CORS pending on bucket). Using server stream fallback...", s3Error);
        return uploadFallback(file, folder);
    }
};

/**
 * Fallback upload to server when direct S3 CORS is pending.
 */
const uploadFallback = async (file, folder) => {
    const apiUrl = getApiBaseUrl();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch(`${apiUrl}/upload/fallback`, {
        method: "POST",
        body: formData,
    });

    const json = await res.json();
    if (!json.success || !json.data) {
        throw new Error(json.message || "Fallback upload failed");
    }

    return json.data;
};

/**
 * Upload multiple files to S3 in parallel.
 *
 * @param {Array<File|Blob>} files - List of files to upload
 * @param {string} folder - The S3 subfolder
 * @returns {Promise<Array<{ url: string, key: string, format: string }>>}
 */
export const uploadFilesToS3 = async (files = [], folder = "uploads") => {
    if (!Array.isArray(files) || files.length === 0) return [];
    return Promise.all(files.map((file) => uploadFileToS3(file, folder)));
};
