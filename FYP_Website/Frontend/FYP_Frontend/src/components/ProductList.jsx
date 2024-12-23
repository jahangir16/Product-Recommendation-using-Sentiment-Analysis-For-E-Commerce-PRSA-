//All products page
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import Header from './Header';
import Footer from './Footer';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1); // Initial page number

  useEffect(() => {
    axios.get(`http://localhost:8080/products?page=${page}`)
      .then(response => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
      });
  }, [page]); // Fetch data whenever the page state changes

  return (
    <div>
      <Header setProducts={setProducts} />
      <main className="w-full overflow-x-hidden flex flex-col items-center min-w-[320px] min-h-screen bg-gray-100">
        <div className="w-full ">
          <div className="p-6">
          <h2 className="text-3xl font-semibold text-gray-800 ">All Products</h2>
          </div>
        
          {products && products.length !== 0 ? (
            <div >
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ) : (
            <p>Loading...</p>
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
}

export default ProductList;