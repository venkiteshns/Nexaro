import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use('/api', router);

app.get('/check', (req, res) => {
    res.status(200).json({ success: true, message: "Check Call Successfull" })
})

app.use(errorHandler);

export default app;