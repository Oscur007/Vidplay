import express from "express";

import { likedVideo , dislikedVideo , likedOrNot , allLikedVideos , removeLikedVideos } from "../controller/likeDislike.js";

import fetchuser from "../middlewares/middleware.js";

const likeDislikeRouter=express.Router();
likeDislikeRouter.get("/likedOrNot/:id" , fetchuser , likedOrNot)
.get("/allLikedVideos" , fetchuser , allLikedVideos)
.patch("/likedVideo" , fetchuser , likedVideo)
.patch("/dislikedVideo" , fetchuser , dislikedVideo)
.patch("/removeLikedVideos" , fetchuser , removeLikedVideos)

export default likeDislikeRouter;