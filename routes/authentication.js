import express from "express";

import { signup , signin , getUser } from "../controller/authentication.js";

import fetchuser from "../middlewares/middleware.js";

const authenticationRouter=express.Router();
authenticationRouter.post("/signup" , signup)
.post("/signin" , signin)
.post("/getUser" , fetchuser , getUser)

export default authenticationRouter;