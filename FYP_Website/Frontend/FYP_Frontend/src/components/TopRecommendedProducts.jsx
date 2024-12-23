import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

function TopRecommendedProducts() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState({});


  const categories = [
    { name: 'SmartPhone ', category: 'smartphones' },
    { name: 'Headset', category: 'headphones-headsets' },
    { name: 'Wearable', category: 'wearable-technology' },
    { name: 'Accessories', category: 'computing-peripherals-accessories' }
    
  ];

  useEffect(() => {
    // Fetch recommended products for each category
    categories.forEach((category) => {
      setLoading((prevLoading) => ({
        ...prevLoading,
        [category.category]: true,
      }));

      axios
        .get(`http://localhost:8080/allRecommendedProducts?category=${category.category}`)
        .then((response) => {
          setProductsByCategory((prevProducts) => ({
            ...prevProducts,
            [category.category]: response.data,
          }));

          setLoading((prevLoading) => ({
            ...prevLoading,
            [category.category]: false,
          }));
        })
        .catch((error) => {
          console.error('Error fetching product details:', error);
          setLoading((prevLoading) => ({
            ...prevLoading,
            [category.category]: false,
          }));
        });
    });
  }, []);

  return (
    <div className="container mx-auto p-4 m-2 bg-white text-gray-800 ">
      

      {/* Recommended Products */}
      <main className="w-full overflow-x-hidden flex flex-col items-center min-w-[320px] min-h-screen bg-gray-100">
        {categories.map((category) => (
          <div key={category.category} className="w-full mb-12">
            <div className="relative flex bg-white items-center mb-7 p-5">
  <div className="flex-grow border-t-2 border-gray-300"></div>
  <h2 className="mx-4 text-3xl font-semibold text-gray-800 whitespace-nowrap">
    Top 10 Recommended {category.name}
  </h2>
  <div className="flex-grow border-t-2 border-gray-300"></div>
</div>

            {/* <h3 className="text-xl font-bold text-gray-700 mb-4">{category.name}</h3> */}

            {loading[category.category] ? (
              <p>Loading...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {productsByCategory[category.category]?.slice(0, 10).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}

export default TopRecommendedProducts;
