/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // Check if the product is a favorite
    axios.get('http://localhost:8080/favorites', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      const favoriteProducts = response.data;
      const isFav = favoriteProducts.some(favProduct => favProduct.id === product.id);
      setIsFavorite(isFav);
    })
    .catch(error => {
      console.error('Error checking favorite status:', error);
    });
  }, [product.id]);

  const addToFavorites = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    axios.post('http://localhost:8080/favorites', {
      productId: product.id
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      console.log('Product added to favorites:', response.data);
      toast.success('Product added to favorites!');
      setIsFavorite(true);
    })
    .catch(error => {
      console.error('Error adding product to favorites:', error);
      toast.error('Error adding product to favorites.');
    });
  };

  const removeFromFavorites = () => {
    axios.delete('http://localhost:8080/favorites', {
      data: { productId: product.id },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      console.log('Product removed from favorites:', response.data);
      toast.warn('Product removed from favorites!');
      setIsFavorite(false);
    })
    .catch(error => {
      console.error('Error removing product from favorites:', error);
      toast.error('Error removing product from favorites.');
    });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={product.image_urls}
          alt={product.productname}
          className="h-full w-full object-contain hover:scale-105 transition-transform"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.productname}</h3>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-500 capitalize text-center flex-grow">{product.category}</p>
          <div className="flex items-center">
            {isFavorite ? (
              <button
                onClick={removeFromFavorites}
                className="text-red-500 hover:text-red-700 transition-colors ml-2 bg-transparent p-1"
              >
                <FaHeart size={24} />
              </button>
            ) : (
              <button
                onClick={addToFavorites}
                className="text-gray-500 hover:text-red-500 transition-colors ml-2 bg-transparent p-1"
              >
                <FaRegHeart size={24} />
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-red-600 font-semibold">{product.discountprice}</p>
          <p className="text-gray-400 line-through text-sm">{product.originalprice}</p>
        </div>
        <Link to={`/product/${product.id}`} className="block">
          <button className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition-colors">
            View Detail
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
