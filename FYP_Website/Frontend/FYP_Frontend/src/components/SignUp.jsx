import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signup', {
        username: username,
        password: password,
        email: email,
      });
      if (response.status === 200) {
        localStorage.setItem('roles', JSON.stringify(response.data.roles));
        localStorage.setItem('username', response.data.username); // Store username
        navigate('/');
      } 
    } catch (error) {
      if (error.response.data.message) {
        setError(error.response.data.message);
      } else {
      setError('Sign up failed');
    }
  }
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-gray-800 text-gray-300 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
            <div>
              <label className="block mb-1">Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-full transition-all transform hover:scale-105">
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SignUp;
