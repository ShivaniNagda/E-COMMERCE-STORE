import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import {redis} from "../lib/redis.js";

const generateTokens = (userId)=>{
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_KEY, {expiresIn:"15m"});
    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_KEY, {expiresIn:"7d"});
    // Store refresh token in redis
   
    return {accessToken, refreshToken};
}

const storeRefreshToken = async(userId,refreshToken)=>{
    // Store refresh token in redis with userId as key and refresh token as value
    await redis.set(`refresh_token:${userId}`,refreshToken,"EX", 60*60*24*7); // 7 days expiration
}

const setCookie = (res,accessToken,refreshToken)=>{
    res.cookie("accessToken", accessToken, {
        httpOnly:true, // httpOnly means that the cookie is not accessible from JavaScript, only from the server
        // secure:true, // secure means that the cookie is only sent over HTTPS, not HTTP :prevent cookie theft/XSS attacks
        // sameSite:"strict", // sameSite means that the cookie is only sent to the same site, not to other sites :prevent CSRF attacks
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge:15*60*1000 // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge:60*60*24*7 // 7 days
    });
}
export const signUp = async(req,res)=>{
  try{
    const {name,email,password} = req.body;
    const userExist = await User.findOne({email});
    console.log("userExist",userExist);
    if(userExist){
        return res.status(400).json({
            success:false,
            message:"User already exists",
        });
    }
        const user = await User.create({
            name,
            email,
            password,
        });
        // Authentication token
        const {accessToken, refreshToken} = generateTokens(user._id);
        // Store refresh token in redis
        await storeRefreshToken(user._id,refreshToken);
        // Set refresh token in cookies
        setCookie(res,accessToken,refreshToken);
        return res.status(201).json({
            success:true,
            message:"User created successfully",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            },
            
        });
  }catch(error){
    console.log(error);
    res.status(500).json({message:error.message});
  }
}

export const login = async(req,res)=>{
   try{
    const {email,password} = req.body;
    console.log("reqbody from authController",req.body);
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Please provide email and password",
        });
    }
    const user = await User.findOne({email});
    console.log("user in controller",user);
    if(user && await user.comparePassword(password)){
        // Authentication token
        const {accessToken, refreshToken} = generateTokens(user._id);
        // Store refresh token in redis
        await storeRefreshToken(user._id,refreshToken);
        // Set refresh token in cookies
        setCookie(res,accessToken,refreshToken);
        return res.status(200).json({
            success:true,
            message:"Login successful",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            },
            
        });
    }else{
        return res.status(400).json({
            success:false,
            message:"Invalid email or password",
        });
    }}catch(error){
        console.log("Error in login controller",error.message);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

export const logout = async(req,res)=>{
   try{
        const refreshToken = req.cookies.refreshToken;
        console.log("refreshToken",refreshToken,req.cookies);
        if(!refreshToken){
            return res.status(400).json({
                success:false,
                message:"No refresh token found",
            });
        }
        // Remove refresh token from redis
        const decode = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_KEY);
        await redis.del(`refresh_token:${decode.userId}`);
        // Remove cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json({
            success:true,
            message:"Logged out successfully",
            });
            
   }catch(error){
    console.log(error);
    res.status(500).json({message:"Server error" ,error:error.message});
   }
}



// Refresh token
// 1. Get refresh token from cookies
export const refreshToken = async(req,res)=>{
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({message:"No refresh token provided"});
        }
        const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_KEY);
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

        if(storedToken !== refreshToken){
            return res.status(401).json({message:"Invalid refresh token"});
        }
        const accessToken = jwt.sign({userId:decoded.userId},process.env.ACCESS_TOKEN_KEY,{expiresIn:"15m"});

        res.cookie("accessToken",accessToken,{
            httpOnly:true,
            maxAge:15*60*1000,
            sameSite:"strict",
            secure:process.env.NODE_ENV === "production",
        })
        res.json({message:"Token refreshed successfully"});
    }catch(error){
        console.log("Error in refreshToken Controller",error);
        res.status(500).json({message:"Server error",error:error.message});
    }

}

// Protect Routes

export const getProfile = async(req,res)=>{
        try{
            console.log("Get Profile Controller",req.user);
            res.json(req.user);
        }catch(error){
            console.log("Error in getProfile Controller",error);
            res.status(500).json({message:"Server error",error:error.message});
        }
}