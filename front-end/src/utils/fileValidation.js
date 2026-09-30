export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_FILE_SIZE_MB = 10;

/**
 * Checks if a given file is an image by its MIME type or extension.
 * @param {File} file 
 * @returns {boolean}
 */
export const isImageFile = (file) => {
    if (!file) return false;
    if (file.type && file.type.startsWith("image/")) {
        return true;
    }
    // Fallback check on file name extension
    if (file.name && typeof file.name === "string") {
        return /\.(jpe?g|png|gif|webp|svg|bmp|avif)$/i.test(file.name);
    }
    return false;
};

/**
 * Validates a single file for image type and max 10MB file size.
 * @param {File} file 
 * @returns {{ isValid: boolean, message?: string }}
 */
export const validateImageFile = (file) => {
    if (!file) {
        return { isValid: false, message: "No file selected." };
    }

    if (!isImageFile(file)) {
        return {
            isValid: false,
            message: `Invalid file format${file.name ? ` for "${file.name}"` : ""}. Only image files are allowed.`,
        };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        return {
            isValid: false,
            message: `File${file.name ? ` "${file.name}"` : ""} is too large. Maximum file size is 10 MB.`,
        };
    }

    return { isValid: true };
};
