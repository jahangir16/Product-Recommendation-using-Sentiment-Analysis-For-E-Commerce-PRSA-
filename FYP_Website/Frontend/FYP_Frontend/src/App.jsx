import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import AdminPanel from './components/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
// import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import AllRecommendedProducts from './components/AllRecommendedProducts';
import CategoryList from './components/CategoryList';
import ProductList from './components/ProductList';
import UserPanel from './components/UserPanel';
import RecommendedProductsByCategory from './components/RecommendedProductsByCategory';
import Home from './components/Home';
import ProductListByCategory from './components/ProductListByCategory';
import SearchResults from './components/SearchResults';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <Router>
      <div>
      <Routes>
      <Route path="/products" element={<ProductListByCategory />} />
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/allProducts" element={<ProductList />} />
        <Route path="/category" element={<CategoryList />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path='/allRecommendedProducts' element={<AllRecommendedProducts />} />
        <Route path="/recommendedProductsByCategory" element={<RecommendedProductsByCategory />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
        <Route path="/user-panel"
         element={<PrivateRoute>
          <UserPanel />
         </PrivateRoute>} />
        
        {/* Other routes */}
      </Routes>
      <ToastContainer />
      </div>
    </Router>
  );
}

export default App;