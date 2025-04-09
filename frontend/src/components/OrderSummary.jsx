import React from 'react';
import {motion} from "framer-motion";
import useCartStore from '../stores/useCartStore';
import { Link } from 'react-router-dom';

const OrderSummary = () => {
    const {total , subTotal,coupon,isCouponApplied} = useCartStore();
    const saving = subTotal - total ;
    const formattedSubTotal = subTotal.toFixed();
    const formattedTotal = total.toFixed();
    const formattedSaving = saving.toFixed();
  return (
    <motion.div className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm
    sm:p-6 '
    initial={{opacity:0 , y:20}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.5}}>

    <p className='text-xl font-semibold text-emerald-400'>Order Summary</p>

    <div className="space-y-4">
        <div className= "space-y-2">
            <dl className= "flex items-center justify-between gap-4">
                <dt className = "text-base font-normal text-gray-300">Original Price</dt>
                <dd className = "text-base font-medium text-white">${formattedSubTotal}</dd>
            </dl>

            {saving > 0 && (
                <dl className= "flex items-center justify-between gap-4">
                     <dt className = "text-base font-normal text-gray-300">Savings</dt>
                     <dd className = "text-base font-medium text-emerald-400">-${formattedSaving}</dd>
                </dl>
            )}

            {coupon && isCouponApplied && (
                   <dl className= "flex items-center justify-between gap-4  border-t border-gray-600 pt-2">
                   <dt className = "text-base font-normal text-gray-300">Coupon ({coupon.code})</dt>
                   <dd className = "text-base font-medium text-emerald-400">-${coupon.discountPercentage}%</dd>
                 </dl>
            )}
              <dl className= "flex items-center justify-between gap-4  border-t border-gray-600 pt-2">
                   <dt className = "text-base font-normal text-gray-300">Total</dt>
                   <dd className = "text-base font-medium text-emerald-400">${formattedTotal}%</dd>
                 </dl>
        </div>
            <motion.button
            className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
            whileHover={{scale:1.05}}
            whileTap={{scale:0.95}}
            // onClick={handleClick}
            >
              <Link to={"/purchase-success"}>
                Proceed to Checkout
                </Link>
            </motion.button>

    </div>

    </motion.div>
  )
}

export default OrderSummary