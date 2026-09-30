import multer from "multer";

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
        const error = new Error("Invalid file format. Only image files are allowed.");
        error.statusCode = 400;
        return cb(error, false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB per file
    },
    fileFilter,
});

export default upload;