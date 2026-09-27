import winston from "winston";
import path from "path";
import fs from "fs";

const __dirname = import.meta.dirname;

// Ensure logs directory exists at project root (back-end/logs/)
const logsDir = path.join(__dirname, "../../logs");

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}



const { combine, timestamp, printf, colorize, errors, splat } = winston.format;

// Pretty format for development console output
const devFormat = combine(
    colorize({ all: true }),
    timestamp({ format: "HH:mm:ss" }),
    errors({ stack: true }),
    splat(),
    printf(({ level, message, timestamp: ts, stack, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
        return stack
            ? `[${ts}] ${level}: ${message}\n${stack}${metaStr}`
            : `[${ts}] ${level}: ${message}${metaStr}`;
    })
);

// Structured JSON format for file logs
const fileFormat = combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    splat(),
    winston.format.json()
);

const transports = [
    // error.log — only ERROR level and above
    new winston.transports.File({
        filename: path.join(logsDir, "error.log"),
        level: "error",
        format: fileFormat,
        maxsize: 5 * 1024 * 1024, // 5 MB
        maxFiles: 5,
        tailable: true,
    }),
    // combined.log — all levels
    new winston.transports.File({
        filename: path.join(logsDir, "combined.log"),
        format: fileFormat,
        maxsize: 10 * 1024 * 1024, // 10 MB
        maxFiles: 5,
        tailable: true,
    }),
];

// Console transport: pretty in dev, JSON in production
if (process.env.NODE_ENV !== "production") {
    transports.push(
        new winston.transports.Console({ format: devFormat })
    );
} else {
    transports.push(
        new winston.transports.Console({ format: fileFormat })
    );
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    transports,
    // Don't crash on unhandled exceptions — log them instead
    exceptionHandlers: [
        new winston.transports.File({ filename: path.join(logsDir, "exceptions.log") }),
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: path.join(logsDir, "rejections.log") }),
    ],
    exitOnError: false,
});

export default logger;
