import express from "express";
import { getAllProduct ,getFeaturedProducts,createProduct,deleteProduct,getRecommendedProducts,getProductsByCategory, toggleFeaturedProduct} from "../controllers/product.controller.js";
import { protectRoute,adminRoute } from "../middleware/auth.middleware.js";
const productRouter = express.Router();

productRouter.get("/",protectRoute,adminRoute,getAllProduct);
productRouter.get("/featured",getFeaturedProducts);
productRouter.get("/category/:category",getProductsByCategory);
productRouter.get("/recommendations",getRecommendedProducts);
productRouter.post("/",protectRoute,adminRoute,createProduct);
productRouter.patch("/:id",protectRoute,adminRoute,toggleFeaturedProduct)
productRouter.delete("/:id",protectRoute,adminRoute,deleteProduct);

export default productRouter;