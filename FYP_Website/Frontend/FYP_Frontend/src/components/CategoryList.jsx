/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import smartphone from '../assets/smartphone.jpg';
import computingperipheralsaccessories from '../assets/computing-peripherals-accessories.jpg';
import wearabletechnology from '../assets/wearable-technology.jpg';
import headphonesheadsets from '../assets/headphones-headsets.jpg';
import { FaArrowRight } from 'react-icons/fa';

const CategoryList = () => {
  const navigate = useNavigate();
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  const categoryLoading = new Array(5).fill(null);

  const dummyCategories = [
    { name: 'SmartPhone', category: 'smartphones', image_urls: smartphone },
    { name: 'Headset', category: 'headphones-headsets', image_urls: headphonesheadsets },
    { name: 'Wearable', category: 'wearable-technology', image_urls: wearabletechnology },
    { name: 'Accessories', category: 'computing-peripherals-accessories', image_urls: computingperipheralsaccessories }
  
  ];

  const fetchCategoryProduct = async () => {
    setLoading(true);
    // Simulate fetching data with dummy data
    setTimeout(() => {
      setCategoryProduct(dummyCategories); // Replace with real API call
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    fetchCategoryProduct();
  }, []);

  return (
    <div className="container mx-auto m-5 p-4 bg-white text-gray-800 bg-gray-50">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-semibold">All Categories</h2>
      </div>

      <div className="flex items-center gap-6 justify-center scrollbar-none">
        {loading ? (
          categoryLoading.map((el, index) => (
            <div
              className="h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-300 animate-pulse"
              key={"categoryLoading" + index}
            ></div>
          ))
        ) : (
          <>
            {categoryProduct.map((product) => (
              <div
                className="cursor-pointer text-center"
                key={product?.category}
                onClick={() => {
                  navigate(`/products?category=${product?.category}`);
                }}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden p-4 bg-gray-200 flex items-center justify-center transition-all transform hover:scale-110">
                  <img
                    src={product?.image_urls}
                    alt={product?.category}
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
                <p className="text-sm md:text-base capitalize mt-2">{product?.name}</p>
              </div>
            ))}

            {/* New "View All Products" Button as Category */}
            <div
              className="cursor-pointer text-center group"
              onClick={() => navigate('/allProducts')}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-blue-500 flex items-center justify-center transition-transform transform group-hover:scale-110">
                <FaArrowRight className="text-blue-500 text-2xl group-hover:text-blue-700" />
              </div>
              <p className="text-sm md:text-base capitalize mt-2 text-blue-500 font-semibold group-hover:text-blue-700">
                View all Products
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
