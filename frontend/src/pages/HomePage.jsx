import React, { useEffect } from 'react'
import CategoryItem from '../components/CategoryItem';
import useProductStore from "../stores/useProductStore";
import FeaturedProducts from '../components/FeaturedProducts';

const categories = [
  { href:"/jeans",name:"Jeans",imageUrl:"../../public/jeans.jpeg"},
  { href:"/t-shirts",name:"Shirts",imageUrl:"../../public/t-shrt.jpeg"},
  { href:"/shoes",name:"Shoes",imageUrl:"../../public/shoes.jpeg"},
  { href:"/jackets",name:"Jackets",imageUrl:"../../public/suit.jpeg"},
  { href:"/bags",name:"Bags",imageUrl:"../../public/bags.jpeg"},
  { href:"/watches",name:"Watches",imageUrl:"../../public/watches.jpeg"},
  { href:"/sunglasses",name:"Sunglasses",imageUrl:"../../public/glassss.jpeg"},
  // { href:"/glasses",name:"Sunglasses",imageUrl:"../../public/latestglass.jpeg"}
]
const HomePage = () => {
  const {fetchFeaturedProducts, products, isLoading} = useProductStore();

  useEffect(()=>{
    fetchFeaturedProducts();
  },[fetchFeaturedProducts]);

  return (
    <div className='relative min-h-screen text-white overflow-hidden'>
      <div className="relative z-10 max-w-7xl mx-auto pz-4 sm:px-6 lg:px-8 py-16">
        <h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
          Explore Our Categories
        </h1>
        <p className='text-center text-gray-300 mb-12 text-xl'>
          Discover the latest trends and styles in fashion.
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-5'>
          {categories.map((category, index) => (
            <CategoryItem key={category.name} category={category} index={index} />
          ))}
      </div>
      {!isLoading && products && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
</div>
    </div>
  )
}

export default HomePage