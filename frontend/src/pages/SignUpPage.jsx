import { motion } from 'framer-motion';
import React, { useState } from 'react'
import { User, UserPlus,Mail,Lock,ArrowRight,Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';

const SignUpPage = () => {
    const loading = false;
    const [formData,setFormData ] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

   const {signup} = useUserStore();
    const handlesubmit = (e) =>{
        e.preventDefault();
        signup(formData);
    }
  return (
    <div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{duration: 0.8 }}>
            <h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400' >Create your account</h2>
        </motion.div>

        <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{duration: 0.8 , delay: 0.2 }}>
            <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form onSubmit={handlesubmit} className='space-y-6'>
                    <div>
                        <label className="block text-sm font-medium text-gray-300" htmlFor="name"> Full Name
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">

                        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                            <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                         
                        <input
                        id="name"
                        type="text"
                        required
                        className="block w-full px-3 py-2 pl-10 rounded-md border border-gray-600  bg-gray-700 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm placeholder-gray-400"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                    </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300" htmlFor="name"> Email address
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">

                        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                            <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                         
                        <input
                        id="email"
                        type="text"
                        required
                        className="block w-full px-3 py-2 pl-10 rounded-md border border-gray-600  bg-gray-700 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm placeholder-gray-400"
                        placeholder="you@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                    </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300" htmlFor="name"> Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">

                        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                         
                        <input
                        id="password"
                        type="password"
                        required
                        className="block w-full px-3 py-2 pl-10 rounded-md border border-gray-600  bg-gray-700 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm placeholder-gray-400"
                        placeholder="******"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />

                    </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300" htmlFor="name"> Confirm Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">

                        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                         
                        <input
                        id="confirmPassword"
                        type="password"
                        required
                        className="block w-full px-3 py-2 pl-10 rounded-md border border-gray-600  bg-gray-700 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm placeholder-gray-400"
                        placeholder="******"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />

                    </div>
                    </div>
                    <button className="mt-5 flex items-center justify-center w-full py-3 px-3 bg-gradient-to-t from-green-500 to-emerald-600 text-white font-bold
              rounder-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 "
              type="submit" disabled={loading}>
                {loading ? (<>
                <Loader className="animate-spin mr-2" size={24} />Loading...</>) :
                (<><UserPlus className='mr-2 h-5 w-5' aria-hidden='true' />SignUp</>)}
                </button>  
                </form>
                </div>

                <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center ">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to={"/login"} className="text-green-400 hover:underline" >Login here <ArrowRight className='inline h-4 w-4' /></Link>
          </p>
        </div>
        </motion.div>
        
    </div>
  )
}

export default SignUpPage