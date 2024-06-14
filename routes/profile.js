import express from "express";

import { myVideos , updateProfile , watchLater , history , updateSubscription , checkSubscription , manageWatchLater , checkWatchLater , getSubscribedChannels , removeHistory } from "../controller/profile.js";

import fetchuser from "../middlewares/middleware.js";

const profileRouter=express.Router();
profileRouter.get('/myVideos', fetchuser , myVideos)
.get('/getWatchLater', fetchuser , watchLater)
.get("/checkWatchLater/:id" , fetchuser , checkWatchLater)
.get('/getHistory', fetchuser , history)
.get("/checkSubscription/:id" , fetchuser , checkSubscription)
.get("/getSubscribedChannels" , fetchuser , getSubscribedChannels)
.patch("/manageWatchLater" , fetchuser , manageWatchLater)
.patch("/updateProfile" , fetchuser , updateProfile)
.patch("/updateSubscription" , fetchuser , updateSubscription)
.patch("/removeHistory" , fetchuser , removeHistory)

export default profileRouter;