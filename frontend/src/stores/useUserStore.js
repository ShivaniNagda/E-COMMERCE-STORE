import {create} from 'zustand';
import axios from '../lib/axios';
import {toast} from 'react-hot-toast';


axios.defaults.withCredentials = true; 
export const useUserStore = create((set,get) =>({
    user: null,
    loading: false,
    checkingAuth:true,
    signup : async({name,email,password,confirmPassword}) =>{
        set({loading:true})
        if(password !== confirmPassword){
            toast.error("Passwords do not match");
            set({loading:false})
            return;
        }
        try{
            const res = await axios.post("/auth/signup",{name,email,password,confirmPassword});
            set({user:res.data.user, loading:false});
        }catch(error){
            set({loading:false});
            toast.error(error.response.data.message || "An error occurred");
        }
    },
    login : async({email,password})=>{
        set({loading:true})
        try{
            const res = await axios.post("/auth/login",{email,password});
            set({user:res.data.user, loading:false});
        }catch(error){
            set({loading:false});
            toast.error(error.response.data.message || "An error occurred");
        }
    },
    logout : async() => {
        set({loading:true});
        try{
            await axios.post("/auth/logout");
            set({user:null, loading:false});
        }catch(error){
            set({loading:false});
            toast.error(error.response?.data?.message || "An error occurred during logout");
        }
    },
    checkAuth : async() =>{
        set({checkingAuth:true});
        try{
            const res = await axios.get("/auth/profile");
            set({user:res.data, checkingAuth:false});
        }catch(error){
            set({checkingAuth:false,user:null});
            console.log(error);
            // toast.error(error.response.data.message || "An error occurred");
        }
    },
    refreshToken : async() =>{
        // Prevent multiple simultaneous refresh attempts
        if(get().checkingAuth) return;
        set({checkingAuth : true});
        try{
            const response = await axios.post("/auth/refresh-token");
            set({checkingAuth : false});
            return response.data;
        }catch(error){
            set({user:null,checkingAuth : false});
            throw error;
        }
    }


}));

    // TODO Implement the axios interceptors for refreshing access token 15s before it expires
    let refreshPromise = null;

    axios.interceptors.response.use(
    (response) => response,
    async(error) =>{
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            try{
                // If refresh is already in progress, wait for it to complete
                if(refreshPromise){
                    await refreshPromise;
                    return axios(originalRequest);
                }
                // Start a new refresh process
                refreshPromise = useUserStore.getState().refreshToken();
                 await refreshPromise;
                // Update the token in the axios instance
                refreshPromise = null ;
                return axios(originalRequest);
            }catch(refreshError){
                console.error(refreshError);
                // if refresh fails , redirect to login or handle as needed
                useUserStore.getState().logout();
                return Promise.reject(refreshError);
            }

        }
        return Promise.reject(error);
    });