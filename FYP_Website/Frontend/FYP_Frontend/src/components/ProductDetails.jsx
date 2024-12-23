import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if the product is a favorite
    axios.get('http://localhost:8080/favorites', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      const favoriteProducts = response.data;
      const isFav = favoriteProducts.some(favProduct => favProduct.id === parseInt(productId));
      setIsFavorite(isFav);
    })
    .catch(error => {
      console.error('Error checking favorite status:', error);
    });
  }, [productId]);

  const addToFavorites = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    axios.post('http://localhost:8080/favorites', {
      productId: productId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
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
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    axios.delete('http://localhost:8080/favorites', {
      data: { productId: productId },
      headers: {
        'Authorization': `Bearer ${token}`
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

  useEffect(() => {
    axios.get(`http://localhost:8080/product/${productId}`)
      .then(response => {
        setProduct(response.data.product);
        console.log(response.data.product);
        if (Array.isArray(response.data.reviews)) {
          setReviews(response.data.reviews);
        } else {
          setReviews([]);
        }
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
      });
  }, [productId]);

  return (
    <div>
      <Header />
      <main className="w-full">
        <div className="bg-white py-8 mx-auto max-w-7xl shadow-lg rounded-lg">
          {product && (
            <div>
              {/* Product Details Section */}
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
                {/* Product Image */}
                <div className="w-full lg:w-1/2 p-6">
                  <img
                    src={product.image_urls}
                    alt={product.productname}
                    className="w-full max-w-xs lg:max-w-lg rounded-lg shadow-md"
                  />
                </div>

                {/* Product Info */}
                <div className="w-full lg:w-1/2 p-6 space-y-6">
                  <h2 className="text-3xl font-semibold text-gray-800">{product.productname}</h2>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <strong className="text-gray-700">Brand:</strong>
                      <span>{product.brandname}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <strong className="text-gray-700">Category:</strong>
                      <span>{product.category}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <strong className="text-gray-700">Rating:</strong>
                      <span>⭐ {product.rating}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-blue-500">{product.discountprice}</span>
                    <span className="text-gray-500 line-through">{product.originalprice}</span>
                  </div>
                  <div className="flex">
                    {isFavorite ? (
                      <button
                        onClick={removeFromFavorites}
                        className="text-red-500 hover:text-red-700 transition-colors ml-2 bg-transparent p-1"
                      >
                        <FaHeart size={29} />
                      </button>
                    ) : (
                      <button
                        onClick={addToFavorites}
                        className="text-gray-500 hover:text-red-500 transition-colors ml-2 bg-transparent p-1"
                      >
                        <FaRegHeart size={29} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <a
                      href={product.producturl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md text-lg font-medium hover:bg-blue-700 hover:text-white hover:shadow-lg transition-all duration-200"
                    >
                      Shop Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Reviews */}
        <div className="bg-white py-8 mx-auto max-w-7xl mt-8 shadow-lg rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Product Reviews</h3>

          {reviews.length === 0 ? (
            <p className="text-gray-600">No Reviews Available</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li key={review.id} className="bg-gray-100 p-6 rounded-lg shadow-md flex items-start gap-4">
                  <div className="space-y-2">
                    <p className="text-gray-800">{review.review_content}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

ProductDetails.propTypes = {
  productId: PropTypes.number.isRequired,
};

export default ProductDetails;