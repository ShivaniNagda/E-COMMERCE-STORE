import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
export const protectRoute = async(req,res,next) => {
    try{
        const accessToken = req.cookies.accessToken;
        if(!accessToken) return res.status(401).json({message: "Unauthorized - No access token provided"});
        try{
            const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_KEY);
            const user = await User.findById(decoded.userId).select("-password");
            if(!user) return res.status(401).json({message: "User not found"});
            req.user = user;
            console.log("Token work correctly");
            next();
        }catch(error){
           if(error.name === "TokenExpiredError"){
            return res.status(401).json({message: "Unauthorized - Access token has expired"});
           }
           throw error;
        }

    }catch(error){
        console.log("Error in protectRoute in controller",error.message);
        res.status(500).json({message: 'Unauthorized - Invalid access token', error: error.message})
    }
}

export const adminRoute = async(req,res,next) =>{
    if(req.user && req.user.role === "admin"){
        console.log("Inside Backend Admin Route ...If")
        next();
    }else{
        console.log("Inside Backend Admin Route ...else")
        return res.status(401).json({message: "Access denied - You are not an admin"});
    }
}