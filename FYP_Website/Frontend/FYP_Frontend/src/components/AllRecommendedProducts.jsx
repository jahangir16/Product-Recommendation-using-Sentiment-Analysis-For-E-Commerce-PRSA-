//Top 10 Recommended Products
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';

function AllRecommendedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8080/allRecommendedProducts`)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch(error => {
        setLoading(false);
        console.error('Error fetching product details:', error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4 bg-white text-gray-800 ">
  <div className="flex justify-between items-center mb-6 border-b-2 border-gray-300 pb-4">
    <h2 className="text-3xl font-semibold text-gray-800">Top 10 Recommended Products</h2>
    <button
      onClick={() => navigate('/recommendedProductsByCategory')}
      className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md text-lg font-medium hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
    >
      View by Category
    </button>
  </div>

  {/* Recommended Products */}
  <main className="w-full overflow-x-hidden flex flex-col items-center min-w-[320px] min-h-screen bg-gray-100">
    <div className="w-full">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {products.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  </main>
</div>

  );
}

export default AllRecommendedProducts;


























