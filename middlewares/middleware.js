import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";

dotenv.config();

const fetchuser = (req, res, next) => {
    const token=req.header("auth-token");
    if (!token) {
        res.status(200).send({ error: "Please authenticate using a valid token" })
    }
    try {
      const data = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      req.user = data.user;
      next();
    } catch (error) {
      console.log(error)
        res.status(402).send({ error: "Please authenticate using a valid token" })
    }
  
  }

export default fetchuser;