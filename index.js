import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import videoRouter from "./routes/video.js";
import jobPortalRouter from "./routes/jobPortal.js";
import authenticationRouter from "./routes/authentication.js";
import profileRouter from "./routes/profile.js";
import likeDislikeRouter from "./routes/likeDislike.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const databaseURL = process.env.DATABASE_URL;

app.use(cors());
app.use(bodyParser.json({limit:"50mb"}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname , process.env.FRONTEND)))
app.use("/api/" , authenticationRouter);
app.use("/api/" , videoRouter);
app.use("/api/" , jobPortalRouter);
app.use("/api/" , profileRouter);
app.use("/api/" , likeDislikeRouter);
app.use("*" , (req , res) =>{
    res.sendFile(path.resolve(__dirname , process.env.FRONTEND , "index.html"))
})
mongoose.connect(databaseURL);

app.listen(port)