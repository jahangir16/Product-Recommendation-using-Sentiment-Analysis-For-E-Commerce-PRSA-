/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';
import Header from './Header';
import Footer from './Footer';

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/products?search=${query}`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [query]);

  return (
    <div>
      <Header />
      <main className="w-full overflow-x-hidden flex flex-col items-center min-w-[320px] min-h-screen bg-gray-100">
        <div className="w-full">
          {loading ? (
            <p>Loading...</p>
          ) : products.length === 0 ? (
            <h2 className="text-3xl m-6 font-semibold text-gray-800">No products found</h2>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;