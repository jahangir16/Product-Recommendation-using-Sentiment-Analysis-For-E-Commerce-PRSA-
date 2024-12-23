import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import CountUp from 'react-countup';

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1); // Initial page number
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [reload, setReload] = useState(false); // State to trigger re-fetch
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSentimentAnalyzedProducts: 0,
  });

  useEffect(() => {
    axios
      .get('http://localhost:8080/product-statistics')
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error('Error fetching statistics:', error);
      });
  }, [reload]);

  useEffect(() => {
    axios.get(`http://localhost:8080/products?page=${page}`)
      .then(response => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
      });
  }, [page, reload]); // Fetch data whenever the page state or reload state changes

  const handleAllSentiment_analysis = () => {
    setLoading(true);
    axios
      .post('http://localhost:5000/analyze_all_products')
      .then((response) => {
        console.log(response.data);
        setLoading(false);
        setNotification('All products analyzed successfully!');
        setReload(!reload); // Trigger re-fetch
        setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
      })
      .catch((error) => {
        console.error('Error analyzing all products:', error);
        setLoading(false);
        setNotification('Error analyzing products.');
        setTimeout(() => setNotification(''), 3000);
      });
  };

  const Sentiment_analysis = (productId) => {
    setLoading(true);
    const data = JSON.stringify({
      "product_id": productId
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:5000/analyze_reviews',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log('Sentiment analysis result:', response.data);
        // Handle the response 
        setLoading(false);
        setNotification(response.data.message ||'Sentiment analysis completed successfully!');
        setReload(!reload); // Trigger re-fetch
        setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
      })
      .catch((error) => {
        console.error('Error during sentiment analysis:', error);
        setLoading(false);
        setNotification('Error during sentiment analysis.');
        setTimeout(() => setNotification(''), 3000);
      });
  };

  return (
    <div>
      <Header />
      
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Panel</h1>
        <div className="container mx-auto p-4">
        <div >
          {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="w-10 h-10 border-4 border-t-white border-gray-300 rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">
            Sentiment analysis is being performed on product reviews
          </p>
        </div>
      )}
        <div className="py-12 bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Product Statistics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto text-center">
        {/* Total Products */}
        <div className="p-8 bg-white rounded shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">Total Products</h3>
          <p className="text-5xl font-bold text-blue-600 mt-4">
            <CountUp start={0} end={stats.totalProducts} duration={3} separator="," />
          </p>
        </div>

        {/* Total Sentiment Analyzed Products */}
        <div className="p-8 bg-white rounded shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">Sentiment Analyzed Products</h3>
          <p className="text-5xl font-bold text-green-600 mt-4">
            <CountUp start={0} end={stats.totalSentimentAnalyzedProducts} duration={3} separator="," />
          </p>
        </div>

        {/* Analyze All Button */}
        <div className="col-span-2 text-center mt-8">
          <button
            onClick={handleAllSentiment_analysis}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-800 focus:outline-none"
          >
            Analyze All Products
          </button>
        </div>
      </div>
    </div>
    </div>
       </div>
        {loading && (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    {/* Spinner */}
    <div className="w-10 h-10 border-4 border-t-white border-gray-300 rounded-full animate-spin mb-4"></div>
    <p className="text-white text-lg">Sentiment analysis is being performed on product reviews</p>
  </div>
)}

        {notification && (
          <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 z-50">
            {notification}
          </div>
        )}
        {products && products.length !== 0 ? (
          <table className="w-full border-collapse mt-6">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Product Image</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <img
                      src={product.image_urls}
                      alt={product.productname}
                      className="w-24 h-auto rounded"
                    />
                  </td>
             
                        <td className="border border-gray-300 px-4 py-2 text-center"
                                onClick={() => navigate('/product/' + product.id)}>
                        {product.productname}
                             </td>


                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => Sentiment_analysis(product.id)}
                      className={`px-4 py-2 rounded ${product.sentiment_analyzed ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700'} text-white`}
                      disabled={product.sentiment_analyzed}
                    >
                      {product.sentiment_analyzed ? 'Analysis Done' : 'Sentiment Analysis'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading...</p>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))}
            className="bg-blue-500 text-white px-4 py-2 mx-2 rounded hover:bg-blue-700"
          >
            Previous Page
          </button>
          <button
            onClick={() => setPage(prevPage => prevPage + 1)}
            className="bg-blue-500 text-white px-4 py-2 mx-2 rounded hover:bg-blue-700"
          >
            Next Page
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminPanel;





// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Header from './Header';

// function AdminPanel() {
//     const [products, setProducts] = useState([]);
//     const [page, setPage] = useState(1); // Initial page number
//     const [loading, setLoading] = useState(false);
//     const [notification, setNotification] = useState('');
  
//     useEffect(() => {
//       axios.get(`http://localhost:8080/products?page=${page}`)
//         .then(response => {
//           setProducts(response.data);
//           console.log(response.data);
//         })
//         .catch(error => {
//           console.error('Error fetching product details:', error);
//         });
//     }, [page]); // Fetch data whenever the page state changes

//     const Sentiment_analysis = (productId) => {
//         setLoading(true);
//         const data = JSON.stringify({
//           "product_id": productId
//         });
    
//         const config = {
//           method: 'post',
//           maxBodyLength: Infinity,
//           url: 'http://localhost:5000/analyze_reviews',
//           headers: { 
//             'Content-Type': 'application/json'
//           },
//           data: data
//         };
    
//         axios.request(config)
//           .then((response) => {
//             console.log('Sentiment analysis result:', response.data);
//             // Handle the response as needed, like displaying it in the UI
//             setLoading(false);
//         setNotification('Sentiment analysis completed successfully!');
//         setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
//           })
//           .catch((error) => {
//             console.error('Error during sentiment analysis:', error);
//             setLoading(false);
//             setNotification('Error during sentiment analysis.');
//             setTimeout(() => setNotification(''), 3000);
//           });
//       };

//       const paginationStyle = {
//         display: 'flex',
//         justifyContent: 'center',
//         marginTop: '2rem',
//       };
    
//       const paginationButtonStyle = {
//         backgroundColor: '#3B82F6',
//         color: 'white',
//         border: 'none',
//         padding: '0.5rem 1rem',
//         margin: '0 0.5rem',
//         cursor: 'pointer',
//         borderRadius: '0.375rem',
//         fontSize: '1rem',
//       };
    
//       const paginationButtonHoverStyle = {
//         backgroundColor: '#2563EB',
//       };

//   return (
//     <div>
//     <Header />
//     <h1>Admin Panel</h1>
//     {loading && (
//       <div className="loading-overlay">
//         <div className="loading-spinner">Loading...</div>
//       </div>
//     )}
//     {notification && (
//       <div className="notification">
//         {notification}
//       </div>
//     )}
//     {products && products.length !== 0 ? (
//       <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
//         <thead>
//           <tr>
//             <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Product Image</th>
//             <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Product Name</th>
//             <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map((product) => (
//             <tr key={product.id}>
//               <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
//                 <img
//                   src={product.image_urls}
//                   alt={product.productname}
//                   style={{ width: '100px', height: 'auto', borderRadius: '5px' }} // Adjust image style as needed
//                 />
//               </td>
//               <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.productname}</td>
//               <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
//               <button
//                   onClick={() => Sentiment_analysis(product.id)}
//                     style={{ padding: '8px 16px', backgroundColor: product.sentiment_analyzed ? '#ccc' : '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: product.sentiment_analyzed ? 'not-allowed' : 'pointer' }}
//                     disabled={product.sentiment_analyzed}
//                             >
//                           {product.sentiment_analyzed ? 'Analysis Done' : 'Sentiment Analysis'}
//               </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     ) : (
//       <p>Loading...</p>
//     )}

//     <div style={paginationStyle}>
//       <button
//         onClick={() => setPage(prevPage => prevPage - 1)}
//         style={paginationButtonStyle}
//         onMouseOver={(e) => e.target.style.backgroundColor = paginationButtonHoverStyle.backgroundColor}
//         onMouseOut={(e) => e.target.style.backgroundColor = paginationButtonStyle.backgroundColor}
//       >
//         Previous Page
//       </button>
//       <button
//         onClick={() => setPage(prevPage => prevPage + 1)}
//         style={paginationButtonStyle}
//         onMouseOver={(e) => e.target.style.backgroundColor = paginationButtonHoverStyle.backgroundColor}
//         onMouseOut={(e) => e.target.style.backgroundColor = paginationButtonStyle.backgroundColor}
//       >
//         Next Page
//       </button>
//     </div>
//   </div>

//   );
      
// }

// export default AdminPanel;

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Header from './Header';
// import { useNavigate } from 'react-router-dom';
// import Footer from './Footer';
// import CountUp from 'react-countup';

// function AdminPanel() {
//   const [products, setProducts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [notification, setNotification] = useState('');
//   const navigate = useNavigate();
//   const [stats, setStats] = useState({
//     totalProducts: 0,
//     totalSentimentAnalyzedProducts: 0,
//   });

//   useEffect(() => {
//     axios.get('http://localhost:8080/product-statistics')
//       .then((response) => setStats(response.data))
//       .catch((error) => console.error('Error fetching statistics:', error));
//   }, []);

//   useEffect(() => {
//     axios.get(`http://localhost:8080/products?page=${page}`)
//       .then(response => setProducts(response.data))
//       .catch(error => console.error('Error fetching products:', error));
//   }, [page]);

//   const handleAllSentimentAnalysis = () => {
//     setLoading(true);
//     axios.post('http://localhost:5000/analyze_all_products')
//       .then(() => {
//         setLoading(false);
//         setNotification('All products analyzed successfully!');
//         setTimeout(() => setNotification(''), 3000);
//       })
//       .catch(() => {
//         setLoading(false);
//         setNotification('Error analyzing products.');
//         setTimeout(() => setNotification(''), 3000);
//       });
//   };

//   const sentimentAnalysis = (productId) => {
//     setLoading(true);
//     axios.post('http://localhost:5000/analyze_reviews', { product_id: productId })
//       .then(() => {
//         setLoading(false);
//         setNotification('Sentiment analysis completed successfully!');
//         setTimeout(() => setNotification(''), 3000);
//       })
//       .catch(() => {
//         setLoading(false);
//         setNotification('Error during sentiment analysis.');
//         setTimeout(() => setNotification(''), 3000);
//       });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header />

//       <div className="container mx-auto px-4 py-6">
//         <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Panel</h1>
// <div>
// {loading && (
//         <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 z-50">
//           <div className="w-10 h-10 border-4 border-t-white border-gray-300 rounded-full animate-spin mb-4"></div>
//           <p className="text-white text-lg">
//             Sentiment analysis is being performed on product reviews
//           </p>
//         </div>
//       )}
//         {/* Statistics Section */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto text-center mb-8">
//           <div className="p-8 bg-white rounded shadow-md">
//             <h3 className="text-xl font-semibold text-gray-700">Total Products</h3>
//             <p className="text-5xl font-bold text-blue-600 mt-4">
//               <CountUp start={0} end={stats.totalProducts} duration={3} separator="," />
//             </p>
//           </div>
//           <div className="p-8 bg-white rounded shadow-md">
//             <h3 className="text-xl font-semibold text-gray-700">Analyzed Products</h3>
//             <p className="text-5xl font-bold text-green-600 mt-4">
//               <CountUp start={0} end={stats.totalSentimentAnalyzedProducts} duration={3} separator="," />
//             </p>
//           </div>
//         </div>

//         <button
//           onClick={handleAllSentimentAnalysis}
//           className="block mx-auto px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-800 focus:outline-none"
//         >
//           Analyze All Products
//         </button>
//         </div>

//         {notification && (
//           <div className="mt-4 bg-blue-500 text-white text-center py-2 rounded">
//             {notification}
//           </div>
//         )}

//         {products.length > 0 ? (
//           <div className="mt-8 overflow-x-auto">
//             <table className="table-auto w-full bg-white shadow-md rounded-lg">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="px-6 py-4 text-left">Product Image</th>
//                   <th className="px-6 py-4 text-left">Product Name</th>
//                   <th className="px-6 py-4 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map((product) => (
//                   <tr key={product.id} className="border-b">
//                     <td className="px-6 py-4">
//                       <img
//                         src={product.image_urls}
//                         alt={product.productname}
//                         className="w-24 h-auto rounded"
//                       />
//                     </td>
//                     <td
//                       className="px-6 py-4 text-blue-600 cursor-pointer hover:underline"
//                       onClick={() => navigate(`/product/${product.id}`)}
//                     >
//                       {product.productname}
//                     </td>
                    
//                     <td className="px-6 py-4 text-center">
//                       <button
//                         onClick={() => sentimentAnalysis(product.id)}
//                         className={`px-4 py-2 rounded text-white ${product.sentiment_analyzed ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700'}`}
//                         disabled={product.sentiment_analyzed}
//                       >
//                         {product.sentiment_analyzed ? 'Analysis Done' : 'Analyze'}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="mt-6 text-gray-600">Loading products...</p>
//         )}

//         <div className="flex justify-center mt-8">
//           <button
//             onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//             className="bg-blue-500 text-white px-4 py-2 mx-2 rounded hover:bg-blue-700"
//           >
//             Previous Page
//           </button>
//           <button
//             onClick={() => setPage((prev) => prev + 1)}
//             className="bg-blue-500 text-white px-4 py-2 mx-2 rounded hover:bg-blue-700"
//           >
//             Next Page
//           </button>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }

// export default AdminPanel;


