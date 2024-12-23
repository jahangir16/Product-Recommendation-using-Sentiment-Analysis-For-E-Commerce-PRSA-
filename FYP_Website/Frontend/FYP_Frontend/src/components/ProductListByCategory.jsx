import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';
import Header from './Header';
import Footer from './Footer';

const ProductListByCategory = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1); // Initial page number
  const [loading, setLoading] = useState(false);

  const fetchProductsByCategory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/products?page=${page}&category=${category}`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsByCategory();
  }, [category, page]);

  return (
    <div>
      <Header />
      <main className="w-full overflow-x-hidden flex flex-col m-6 pr-6 pt-6items-center min-w-[320px] min-h-screen bg-gray-100">
        <div className="w-full">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
            <div className="p-6">
              <h2 className="text-3xl font-semibold text-gray-800">Products in {category}</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
          )}

          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))}
              className="bg-blue-500 text-white border-none px-4 py-2 mx-2 cursor-pointer rounded-md text-lg hover:bg-blue-700"
              disabled={page === 1}
            >
              Previous Page
            </button>
            <button
              onClick={() => setPage(prevPage => prevPage + 1)}
              className="bg-blue-500 text-white border-none px-4 py-2 mx-2 cursor-pointer rounded-md text-lg hover:bg-blue-700"
            >
              Next Page
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductListByCategory;