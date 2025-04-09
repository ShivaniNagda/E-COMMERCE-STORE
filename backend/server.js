import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import connectToDB from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js"
import analyticsRoutes from "./routes/analytics.route.js"
import loggerMiddleware from "./middleware/logger.middleware.js";




const app = express();
const PORT = process.env.PORT || 5000;

const _dirname = path.resolve();


app.use(express.json({limit:"10mb"}));
app.use(cookieParser());
app.use(loggerMiddleware);

app.use("/api/auth",authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/coupons",couponRoutes);
app.use("/api/analytics",analyticsRoutes);
// app.use("/api/payment",paymentRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname,"/frontend/dist")));
    
    app.get(/(.*)/,(req,res)=>{
        console.log("Unhandled route:", req.url); 
        res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"));
    })
}

app.listen(PORT, () => {
    connectToDB();
    console.log(`Server is running on http://localhost: ${PORT}`);
    }
);
