import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signin', {
        email: email,
        password: password,
      });
      if (response.status === 200) {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('roles', JSON.stringify(response.data.roles));
        localStorage.setItem('username', response.data.username);
        navigate('/admin');
      } 
    } catch (error) {
      if (error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Sign in failed');
      }
     
    }
  };

  return (
    <div>
      <Header />
   
    <section id="signin" className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-gray-800 text-gray-300 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
          <div>
            <label className="block mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-700 text-gray-300 focus:ring focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-700 text-gray-300 focus:ring focus:ring-blue-500 outline-none"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-full transition-all transform hover:scale-105">
            Sign In
          </button>
        </form>
        <p className="text-center mt-4">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline hover:text-blue-600">
            Sign Up
          </a>
        </p>
      </div>
    </section>
    <Footer />
    </div>
  );
}

export default SignIn;