import express from "express";
import multer from "multer";
import { getAvailableJobs , postJob , applyJob , getAppliedJobs , getPostedJobs , deletePostedJob , deleteAppliedJob , removeApplication } from "../controller/jobPortal.js";
import fetchuser from "../middlewares/middleware.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const jobPortalRouter=express.Router();
jobPortalRouter.get('/getAvailableJobs', fetchuser , getAvailableJobs)
.get('/getAppliedJobs', fetchuser , getAppliedJobs)
.get('/getPostedJobs', fetchuser , getPostedJobs)
.post("/postJob" , fetchuser , postJob)
.post("/applyJob" , fetchuser , upload.fields([{ name: 'resume', maxCount: 1 }]), applyJob)
.patch("/removeApplication" , fetchuser , removeApplication)
.delete("/deletePostedJob/:id" , fetchuser , deletePostedJob)
.delete("/deleteAppliedJob/:id" , fetchuser , deleteAppliedJob)

export default jobPortalRouter;