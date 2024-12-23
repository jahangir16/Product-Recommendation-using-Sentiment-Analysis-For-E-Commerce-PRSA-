import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import smartphone from '../assets/smartphone.jpg';
import computingperipheralsaccessories from '../assets/computing-peripherals-accessories.jpg';
import wearabletechnology from '../assets/wearable-technology.jpg';
import headphonesheadsets from '../assets/headphones-headsets.jpg';
import { FaArrowRight } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

const RecommendedProductsByCategory = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1); // Initial page number

  const categories = [
    { name: 'SmartPhone', category: 'smartphones', image_urls: smartphone },
    { name: 'Headset', category: 'headphones-headsets', image_urls: headphonesheadsets },
    { name: 'Wearable', category: 'wearable-technology', image_urls: wearabletechnology },
    { name: 'Accessories', category: 'computing-peripherals-accessories', image_urls: computingperipheralsaccessories }
    // Add more categories as needed
  ];

  useEffect(() => {
    axios.get(`http://localhost:8080/allRecommendedProducts?page=${page}&category=${selectedCategory}`)
      .then(response => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
      });
  }, [page, selectedCategory]);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <div>
    <Header />
    <div className='container mx-auto p-4'>
    <h2 className="text-3xl font-semibold text-gray-800">Recommended Products</h2>
      {/* Category Selection */}
      <div className='flex items-center gap-6 justify-center scrollbar-none'>
        {categories.map((category) => (
          <div
            key={category.name}
            className='cursor-pointer'
            onClick={() => {
              setSelectedCategory(category.category);
              setPage(1);
            }}
          >
            <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center'>
              <img
                src={category.image_urls}
                alt={category.name}
                className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'
              />
            </div>
            <p className='text-center text-sm md:text-base capitalize'>{category.name}</p>
          </div>
        ))}
         {/* View All Products Button */}
      <div
      
        onClick={() => {
          // You can navigate to a different page or handle the "view all products" functionality here
          setSelectedCategory('');
          setPage(1);
        }}
      >
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-blue-500 flex items-center justify-center transition-transform transform hover:scale-110">
          <FaArrowRight className="text-blue-500 text-2xl group-hover:text-blue-700" />
        </div>
        <p className="text-sm md:text-base capitalize mt-2 text-blue-500 font-semibold group-hover:text-blue-700">
          View all Products
        </p>
      </div>
      </div>

      {/* Recommended Products */}
      <div className='mt-8'>
        {filteredProducts.length !== 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}

        <div className='flex justify-center mt-8'>
          <button
            onClick={() => setPage(prevPage => prevPage - 1)}
            className='bg-blue-500 text-white border-none px-4 py-2 mx-2 cursor-pointer rounded-md text-lg hover:bg-blue-700'
          >
            Previous Page
          </button>
          <button
            onClick={() => setPage(prevPage => prevPage + 1)}
            className='bg-blue-500 text-white border-none px-4 py-2 mx-2 cursor-pointer rounded-md text-lg hover:bg-blue-700'
          >
            Next Page
          </button>
        </div>
      </div>

     
    </div>
    <Footer />
    </div>
  );
};

export default RecommendedProductsByCategory;


// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import ProductCard from './ProductCard';
// import smartphone from '../assets/smartphone.jpg';
// import computingperipheralsaccessories from '../assets/computing-peripherals-accessories.jpg';
// import wearabletechnology from '../assets/wearable-technology.jpg';
// import headphonesheadsets from '../assets/headphones-headsets.jpg';

// const RecommendedProductsByCategory = () => {
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [page, setPage] = useState(1); // Initial page number

//   const categories = [
//     { name: 'SmartPhone', category: 'smartphones', image_urls: smartphone },
//     { name: 'Headset', category: 'headphones-headsets', image_urls: headphonesheadsets },
//     { name: 'Wearable', category: 'wearable-technology', image_urls: wearabletechnology },
//     { name: 'Accessories', category: 'computing-peripherals-accessories', image_urls: computingperipheralsaccessories }
//     // Add more categories as needed
//   ];

//   useEffect(() => {
//     axios.get( `http://localhost:8080/allRecommendedProducts?page=${page}&category=${selectedCategory}`
// )
//       .then(response => {
//         setProducts(response.data);
//         console.log(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching product details:', error);
//       });
//   }, [page,selectedCategory]);

//   const filteredProducts = selectedCategory
//     ? products.filter(product => product.category === selectedCategory)
//     : products;

//   return (
//     <div className='container mx-auto p-4'>
//       <div className='flex items-center gap-4 justify-between overflow-scroll scrollbar-none'>
//         {categories.map((category) => (
//           <div
//             key={category.name}
//             className='cursor-pointer'
//             onClick={() => {
//               setSelectedCategory(category.category);
//               setPage(1);
//             }}
            
//           >
//             <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center'>
//               <img src={category.image_url} alt={category.name} className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'/>
//             </div>
//             <p className='text-center text-sm md:text-base capitalize'>{category.name}</p>
//           </div>
//         ))}
//       </div>

//           <div className='mt-8'>
//           {filteredProducts.length !== 0 ? (
//             <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
//               {products.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//         ) : (
//           <p>Loading...</p>
//         )}

//         <div className='flex justify-center mt-8'>
//           <button
//             onClick={() => setPage(prevPage => prevPage - 1)}
//             className='bg-blue-500 text-white border-none px-4 py-2 mx-2 cursor-pointer rounded-md text-lg hover:bg-blue-700'
//           >
//             Previous Page
//           </button>
//           <button
//             onClick={() => setPage(prevPage => prevPage + 1)}
//             className='bg-blue-500 text-white border-none px-4 py-2 mx-2 cursor-pointer rounded-md text-lg hover:bg-blue-700'
//           >
//             Next Page
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecommendedProductsByCategory;