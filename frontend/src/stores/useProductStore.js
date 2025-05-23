import React from 'react';
import toast from "react-hot-toast";
import axios from "../lib/axios"
import {create} from "zustand";


const useProductStore = create((set) => ({
    products:[],
    loading:false,

    setProducts:(products) => set({products}),

    createProduct : async(productData) => {
        set({loading:true});
        try{
            const res= await axios.post("/products",productData);
            set((prevState)=>({
                products:[...prevState.products,res.data],
                loading:false
            }));

        }catch(error){
            console.log(error);
            toast.error(error.response.data.error);
            set({loading:false});
        }
    },
    fetchAllProducts : async() =>{
        set({loading :true});
        try{
            const response = await axios.get("/products");
            set({products:response.data.products , loading:false});
        }catch(error){
            set({error:"Failed to Fetch products",loading:false});
            toast.error(error.response.data.error || "Failed to fetch products");
        }
    },
    fetchProductsByCategory: async(category) =>{
        set({loading:true});
        try{
            const response = await axios.get(`/products/category/${category}`);
            set({products:response.data.products,loading:false});
            }catch(error){
                set({error:"Failed to Fetch products",loading:false});
                toast.error(error.response.data.error || "Failed to fetch products");
                }

    },
    deleteProduct : async (productId) =>{
        set({loading:true});
        try{
            await axios.delete(`/products/${productId}`);
            set((prevState)=>({
                products:prevState.products.filter((product)=>product._id !== productId),
                loading:false
                }));
                toast.success("Product delete Successfully")
                }catch(error){
                    console.log(error);
                    toast.error(error.response.data.error || "Failed to delete product");
                    set({loading:false});
                    }
    },
    toggleFeaturedProduct : async (productId) =>{
        set({loading:true});
        try{
            const response = await axios.patch(`/products/${productId}`);
            set((prevState)=>({
                products:prevState.products.map((product)=>
                    product._id === productId ?
                        {...product, isFeatured: response.data.isFeatured} : product),
                       loading:false,
    }));
        }catch(err){
            console.log(err);
            set({loading:false});
            toast.error(error.response.data.error || "Failed to update product");
        }
    },
    fetchFeaturedProducts: async() =>{
        set({loading:true});
      
        try{
            const response = await axios.get('/products/featured');
            set({products:response.data,loading:false});
            }catch(error){
                set({error:"Failed to Fetch products",loading:false});
                console.log("Failed to fetch products",error);
                // toast.error(error.response.data.error || "Failed to fetch products");
            }
    }
    }));

export default useProductStore;