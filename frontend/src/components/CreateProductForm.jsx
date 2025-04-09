import { motion } from 'framer-motion'
import { PlusCircle, Upload, Loader } from 'lucide-react';
import React, { useState } from 'react'
import useProductStore from '../stores/useProductStore';


const categories = ["jeans","t-shirts","shoes","sunglasses","jackets","suits","bags","watches"];
const CreateProductForm = () => {
  const [newProduct, setNewProduct] =useState({
    name: "",
    price: "",
    description: "",
    category:"",
    image:""
  })
  const {createProduct ,loading} = useProductStore();
  const handleSubmit = async(e) =>{
    e.preventDefault();
  try{
    await createProduct(newProduct);
    setNewProduct({name:"",price:"",description:"",category:"",image:""})
  }catch(error){
    console.log(error);
  }
  }
  const handleImageChange = (e) =>{
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({...newProduct,image:reader.result});
    }
    reader.readAsDataURL(file); //base64format
     }
    }
  return (
    <motion.div className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
    initial={{opacity:0 , y:20}}
    animate={{opacity:1 , y:0}}
    transition={{duration:0.8}}
    >
      <h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Product</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='name' className="block text-sm font-medium text-gray-300">
            Product Name
          </label>
          <input 
          type='text'
          id='name'
          name='name'
          value={newProduct.name}
          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
          className="block w-full px-3 py-2 mt-1 bg-gray-700 border text-white border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
       " required/> 
       
       </div>
        <div>
          <label htmlFor='description' className="block text-sm font-medium text-gray-300">
          Description
          </label>
          <textarea 
        
          id='description'
          name='description'
          value={newProduct.description}
          rows="3"
          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
          className="block w-full px-3 py-2 mt-1 bg-gray-700 border text-white border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
       " required/> 
       
       </div>
        <div>
          <label htmlFor='price' className="block text-sm font-medium text-gray-300">
            Price
          </label>
          <input 
          type='number'
          id='price'
          name='price'
          value={newProduct.price}
          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
          step="0.01"
          className="block w-full px-3 py-2 mt-1 bg-gray-700 border text-white border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
       " required/> 
       
       </div>
        <div>
          <label htmlFor='category' className="block text-sm font-medium text-gray-300">
            Category
          </label>
          <select 
          id='category'
          name='category'
          value={newProduct.category}
          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
          className="block w-full px-3 py-2 mt-1 bg-gray-700 border text-white border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
       " required> 
        <option value="">Select a category</option>
        {categories.map((category)=>(
          <option key={category} value={category}>
            {category}
          </option>
        ))}
        </select>
       </div>
        
        <div className='mt-1 flex items-center overflow-hidden'>
        <input type='file' id='image' className="sr-only" accept='image/*' onChange={handleImageChange}/>
          <label htmlFor='image' className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-md text-sm leading-4 font-medium text-gray-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500 hover:text-emerald-900">
            <Upload className='h-5 w-5 inline-block mr-2' />
            Upload Image
          </label>
          {newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image Uploaded</span>}
        </div>
      
        <button type='submit' 
        className='w-full flex justify-center py-2 px04 border border-transparent rounded-md shadow-sm
        text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus-ring-offset-2 focus:ring-emerald-500 disabled:opacity-50' disabled={loading}>
          {loading ? (
            <>
              <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
              Loading...
            </>
          ):(
            <>
            <PlusCircle className='mr-2 h-5 w-5' />
            Create Product
            </>
          )}
        </button>

      </form>

    </motion.div>
  )
}

export default CreateProductForm