import express from "express";
import multer from "multer";
import { uploadVideo , allImages , searchVideos , playVideo , deleteVideo , updateViews } from "../controller/video.js";
import fetchuser from "../middlewares/middleware.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const videoRouter=express.Router();
videoRouter.get("/allImages" , allImages)
.get("/searchVideos" , searchVideos)
.get('/playVideo/:id', playVideo)
.post("/upload" , fetchuser , upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), uploadVideo)
.patch("/updateViews" , updateViews)
.delete('/deleteVideo/:id' , fetchuser , deleteVideo)

export default videoRouter