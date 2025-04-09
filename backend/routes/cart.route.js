import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controllers/cart.controller.js";


const cartRouter = express.Router();

cartRouter.get('/',protectRoute, getCartProducts);
cartRouter.post('/',protectRoute, addToCart);    
cartRouter.delete('/:id',protectRoute, removeAllFromCart);    
cartRouter.put('/:id',protectRoute, updateQuantity);


export default cartRouter;