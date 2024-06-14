import User from "../model/user.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const signup = async (req , res)=>{
    try
    {
      let oldUser=await User.findOne({email : req.body.email})
      if(oldUser)
      {
        return res.status(400).send("Email already exists");
      }
      oldUser=await User.findOne({username : req.body.username})
      if(oldUser)
      {
        return res.status(400).send("User already exists");
      }
      const salt=await bcryptjs.genSalt(10);
      const secPass=await bcryptjs.hash(req.body.password , salt);
      const newUser=new User({
        username : req.body.username,
        email : req.body.email,
        password : secPass,
        createdOn : req.body.createdOn
      })
      await newUser.save();
      const data={
        user : {
        userid : newUser._id
        }
      }
      const authToken=jsonwebtoken.sign(data , process.env.JWT_SECRET);
      res.send({authToken}).status(200);
    }
    catch(err)
    {
      console.log(err);
      res.send("Error occured").status(500);
    }
}
  
const signin = async (req , res)=>{
    try {
      const oldUser=await User.findOne({email : req.body.email})
      if(!oldUser)
      {
        return res.status(400).send("Please log in with correct details");
      }
      const passwordCompare = await bcryptjs.compare(req.body.password, oldUser.password);
      if(!passwordCompare)
      {
        return res.status(400).send("Please log in with correct details");
      }
      const data={
        user : {
        userid : oldUser._id
        }
      }
      const authToken=jsonwebtoken.sign(data , process.env.JWT_SECRET);
      res.send({authToken}).status(200);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
}
  
const getUser = async (req , res)=>{
    try {
      const userId=req.user.userid;
      const data=await User.findById(userId).select("-password");
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
}

export { signup , signin , getUser }