import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import Header from './Header';
import Footer from './Footer';

const UserPanel = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  
  useEffect(() => {
    

    axios.get('http://localhost:8080/favorites', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      setFavoriteProducts(response.data);
      console.log(response.data);
    })
    .catch(error => {
      console.error('Error fetching favorite products:', error);
    });
  }, []);

  return (
    <div>
  <Header />
  <main className="w-full overflow-x-hidden flex flex-col items-center min-w-[320px] min-h-screen bg-gray-100">
    <div className="w-full">
      {/* Main Title */}
      <h1 className="text-3xl font-bold text-center text-gray-800 p-6">
        User Panel
      </h1>

      {/* Favorite Products Heading */}
      {favoriteProducts.length !== 0 ? (
        <div>
          <h2 className="text-3xl font-semibold text-left ml-6 text-gray-800 mb-8">
            Your Favorite Products:
          </h2>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-xl text-gray-600">Loading your favorite products...</p>
      )}
    </div>
  </main>
  <Footer />
</div>

  

  );
};

export default UserPanel;