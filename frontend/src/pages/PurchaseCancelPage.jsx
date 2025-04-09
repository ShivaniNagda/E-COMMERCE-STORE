import React from 'react'
import {XCircle, ArrowLeft} from "lucide-react";
import {motion} from "framer-motion";
import {Link} from "react-router-dom";
const PurchaseCancelPage = () => {
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <motion.div
      initial={{opacity:0,y:20}}
      animate={{opacity:1,y:0}}
      transition={{duration:0.5}}
      className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'
      >
        <div className='p-6 sm:p-8'>
          <div className="flex justify-center">
            <XCircle className="text-red-500 w-16 h-16 mb-4" />
          </div>
          <h1 className='text-2xl sm:text-3xl font-bold text-center text-red-500 mb-2'>
            Purchase Cancelled
          </h1>
          <p className='text-gray-300 text-center mb-6 '>
            Your order has been cancelled. No Charges have been made.
          </p>

          <div className='bg-gray-700 rounded-lg p-4 mb-6'>
          <p className='text-gray-400 text-center mb-6 '>
           If you encountered any issue during the checkout process,please don&apos;t hesitate to contact our support team.
          </p>

          </div>
        </div>

      </motion.div>
    </div>
  )
}

export default PurchaseCancelPage;