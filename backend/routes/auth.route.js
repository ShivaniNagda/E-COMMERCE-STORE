import express from 'express';
import { signUp,login, logout , refreshToken , getProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const authRouter = express.Router();
authRouter.post("/signup",signUp);
authRouter.post("/login",login);
authRouter.post("/logout",logout);
authRouter.post("/refresh-token",refreshToken);
authRouter.get("/profile",protectRoute, getProfile);


export default authRouter;