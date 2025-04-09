import React from 'react';
import { Link } from 'react-router-dom';

const CatgoryItem = ({ category }) => {
  return (
    <div className='relative overflow-hidden h-96 w-full group rounded-lg'>
      <Link to={`/category/${category.href}`}>
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10' />
        <img
          src={category.imageUrl}
          alt={category.name}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out'
          loading='lazy'
        />
        <div className='absolute bottom-0 left-0 right-0 p-4 z-20'>
          <h2 className='text-2xl font-bold text-white'>{category.name}</h2>
          <p className='text-gray-300 text-sm mt-1'>
            Discover the latest trends in {category.name}.
          </p>
        </div>
      </Link>
    </div>
  );
};

export default CatgoryItem;
