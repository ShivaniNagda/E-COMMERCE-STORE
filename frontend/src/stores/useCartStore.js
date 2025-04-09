import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useCartStore = create((set,get) =>({
    cart:[],
    coupon:null,
    total:0,
    subTotal:0,
    isCouponApplied:false,
    

    getMyCoupon : async() =>{
            try{
                const response = await axiosInstance.get('/coupons');
                set({coupon:response.data});
            }catch(error){
                console.error("Error fetching coupon:",error);
            }
    },
    applyCoupon: async(code) =>{
        try{
            const response = await axiosInstance.post('/coupons/validate',{code});
            set({coupon: response.data, isCouponApplied:true});
            get().calculateTotals();
            toast.success("Coupon applied successfully");
        }catch(error){
            console.error("Error applying coupon:",error);
            toast.error(error.response?.data?.message || "Invalid coupon code");
        }
    },
    removeCoupon : () =>{
        set({coupon:null,isCouponApplied:false});
        get().calculateTotals();
        toast.success("Coupon removed");
    },
    getCartItem : async() => {
        try{
        const res = await axiosInstance.get("/cart");
        set({cart:res.data});
        get().calculateTotals();
    }catch(error){
        set({cart:[]});
        toast.error(error.response.data.message || "An error occurred");
    } 
    },
    clearCart : async () => {
        set({cart:[], coupon:null, total:0,subTotal:0})
    },  
    addToCart : async(product) => {
        try {
            const res = await axiosInstance.post("/cart",{productId:product._id} );
            toast.success("Product added to cart");
            set((state) => {
                const existingItem = state.cart.find((item) => item._id === product._id);
                const newCart = existingItem
                    ? state.cart.map((item) =>
                          item._id === product._id
                              ? { ...item, quantity: item.quantity + 1 }
                              : item
                      )
                    : [...state.cart, { ...product, quantity: 1 }];
                return { cart: newCart };
            });
            get().calculateTotals();
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred");
        }
        
    },
    removeFromCart : async(productId) => {
        try{
    
        const res = await axiosInstance.delete(`/cart/${productId}`);
        console.log("call RemoveFrom Cart",res.data);
        set(prevState => ({cart:prevState.cart.filter(item => item._id !== productId)}));
        get().calculateTotals();
        }catch(error){
            console.log(error);
            toast.error("Something went Wrong");
        }
    },
    updateQuantity : async(productId, quantity) => {
        try{
        if(quantity === 0){
            get().removeFromCart(productId);
            return
        }
      
    const data = await axiosInstance.put(`/cart/${productId}`,{quantity});
    console.log("Update quantity");
        set((prevState) =>({
            cart:prevState.cart.map(item => item._id === productId ? {...item,quantity} :
                item)
        }));
        get().calculateTotals();
    
    }catch(error){
        console.log(error.message);
        toast.error("Something went Wrong");
    }
    },

    calculateTotals : () =>{
        const {cart,coupon} = get();
        const subTotal = cart.reduce((sum,item) => sum  + item.price *  item.quantity,0);
        let total = subTotal;
        if(coupon){
            total = subTotal - (subTotal * coupon.discountPercentage/100);
        }
        set({subTotal,total});
    },
   
}));

export default useCartStore;