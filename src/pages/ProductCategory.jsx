import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const ProductCategory = () => {
    const { products } = useAppContext();
    const { category } = useParams();

    // Search for a category object in the 'categories' array
    // 'categories' is assumed to be an array of objects, each representing a category with a 'path' property
    const searchCategory = categories.find((item) =>
        // For each 'item' in the 'categories' array, compare its 'path' (converted to lowercase)
        // with the 'category' string obtained from the URL (via useParams)
        item.path.toLowerCase() === category
    );
    // The result will be the first matching category object where 'path' matches the URL parameter 'category'
    // If no match is found, 'searchCategory' will be undefined

    const filteredProducts = products.filter((product) => product.category.toLowerCase() === category)

    return (
        <div className='mt-16'>
            {searchCategory && (
                <div className='flex flex-col items-end w-max' >
                    <p className='text-2xl font-medium' >{searchCategory.text.toUpperCase()}</p>
                    <div className='w-16 h-0.5 bg-primary rounded-full' ></div>
                </div>
            )}

            {filteredProducts.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6' >
                    {filteredProducts.map((product) => {
                        return <ProductCard key={product._id} product={product} />
                    })}
                </div>
            ) : (
                <div className='flex items-center justify-center h-[60vh]' >
                    <p className='text-2xl font-medium text-primary' >No products found in this Category.</p>
                </div>
            )}
        </div>
    )
}

export default ProductCategory