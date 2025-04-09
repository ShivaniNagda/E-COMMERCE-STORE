import Product from "../models/product.model.js";
import {ObjectId} from "mongodb";

export const getCartProducts = async(req,res) =>{
    try{
        const products = await Product.find({_id:{$in:req.user.cartItems}});
        const cartItems = products.map(product =>{
            const item = req.user.cartItems.find(cartItems=>cartItems.id === product.id);
            return {...product.toJSON(),quantity:item.quantity}
            });
            res.json(cartItems);
    }catch(error){
        console.error("Error getting cart products in controller" ,error.message);
        res.status(500).send({message: 'Error getCartProducts'});

    }
}
export const addToCart = async(req,res)=>{
    console.log("Add to Cart in controller : ",req.body);
  try{
    const {productId} = req.body;
    const user = req.user;
    // console.log("Add to Cart in controller : ", productId,req.body ,user, new ObjectId(productId));

    const existingItem = user.cartItems.find(item=> item._id.equals(new ObjectId(productId)));
    console.log("ExistingItem...",existingItem);
    if(existingItem){
        existingItem.quantity += 1;
    }else{
        user.cartItems.push(productId);
    }
    await user.save();
    res.json({cartItems:user.cartItems,message:"Item added to cart"});
}catch(error){
    console.error("Error adding item to cart in controller" ,error);
    res.status(500).send({message: 'Error adding item to cart'});
}
}

export const removeAllFromCart = async(req,res)=>{
    try{
        console.log("removeAllFromCart in controller",req.body,req.params.id);
      const productId = req.params.id;
      const user = req.user;
  
      if(!productId){
         user.cartItems=[];
      }else{
          user.cartItems=user.cartItems.filter((item)=>item.id !==productId);
          console.log("RemoveInCart","else",user);
      }
      await user.save();
      console.log("RemoveInCart",user);
      res.json({cartItems:user.cartItems,message:"Item removed to cart"});
  }catch(error){
      console.error("Error adding item to cart in controller" ,error);
      res.status(500).send({message: 'Error adding item to cart'});
  }
}

export const updateQuantity = async(req,res)=>{
    try{
        const {id:productId} = req.params;
        const {quantity} = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find(item=>item._id.equals(new ObjectId(productId)));
        console.log("existingItem:",existingItem);
        if(existingItem){
            if(quantity===0){
           user.cartItems = user.cartItems.filter((item)=>!item._id.equals(new ObjectId(productId)));
        }else{
            existingItem.quantity = quantity;
        }
        await user.save();
    }
    return res.json(user.cartItems);
}catch(error){
    console.error("Error updating quantity in controller" ,error);
    res.status(500).send({message: 'Error updating quantity'});
}
}

