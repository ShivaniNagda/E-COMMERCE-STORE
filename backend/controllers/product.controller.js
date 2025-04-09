import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";
export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    //if not in redis , fetch from mongodb
    //   .lean() is gonna return a plain js object instead of a mongodb document
    // which is good for user performance
    console.log("Inside Backend featured product controller ")
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }
    //store in redis for future quick access
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    let publicId;
    if (product.image) {
       publicId = product.image.split("/").pop().split(".")[0];
    }
    try {
      await cloudinary.uploader.destroy(`products/${publicId}`);
      console.log("deleted Image from cloudinary");
    } catch (error) {
      console.log("Error deleting image from cloudinary", error.message);
    }
    await Product.findByIdAndDelete(productId);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    console.log("recommendations");
    const products = await Product.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);
    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    console.log("Inside the controller category",category)
    const products = await Product.find({ category });
    console.log("Inside the controller products",products)
    res.json({products});
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const toggleFeaturedProduct = async(req,res) =>{
    try{
        const product = await Product.findById(req.params.id);
        if(product){
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updatedFeaturedProductCache();

            res.json(updatedProduct);
        }else{
            res.status(404).json({message: "Product not found"});
        }
        }catch(error){
            console.log("Error in toggleFeaturedProduct controller", error.message);
            res.status(500).json({message: "Server error", error: error.message});
        }
}

async function updatedFeaturedProductCache() {
        try{
            // The Lean() method is used to return plain javascript objects.instead of full Mongoose documents. This can signicqantly improve performance
            const featured_products= await Product.find({isFeatured:true}).lean();
            await redis.set("featured_products",JSON.stringify(featured_products));
        }catch(error){
            console.log("Error in updatedFeaturedProductCache function", error.message);

        }

}