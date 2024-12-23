import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from "../assets/logo22.png";

function Header() {
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState('');
  const [roles, setRoles] = useState([]);

  const handleSearch = () => {
    navigate(`/search?query=${searchTerm}`);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedRoles = localStorage.getItem('roles');
    try {
      setRoles(storedRoles ? JSON.parse(storedRoles) : []);
    } catch (error) {
      console.error('Error parsing roles from localStorage:', error);
      setRoles([]);
    }
    setUsername(storedUsername);
    const token = localStorage.getItem('token');
    setIsSignedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    setIsSignedIn(false);
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleUserClick = () => {
    if (roles.includes('admin')) {
      navigate('/admin');
    } else if (roles.includes('user')) {
      navigate('/user-panel');
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white p-2 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <a
          href="/"
          className="flex items-center text-2xl font-extrabold tracking-wider text-black hover:text-indigo-800 transition-all duration-300 whitespace-nowrap"
        >
          <img src={logo} alt="logo" className="w-40 h-20" />
        </a>

        <div className="flex items-center justify-between w-full">
          {/* Search Section */}
          <div className="relative flex items-center ml-auto">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onKeyDown={handleKeyDown}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 p-3 pl-12 rounded-full shadow-md focus:outline-none text-white bg-gray-800"
            />
            <svg
              className="absolute left-4 text-white w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
            <button
              onClick={handleSearch}
              className="ml-4 px-4 py-3 rounded-md bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold shadow-md hover:from-purple-600 hover:to-blue-700 transition-all"
            >
              Search
            </button>
          </div>

          {/* Space between Search and User Section */}
          <div className="flex items-center space-x-6 ml-4">
            {isSignedIn ? (
              <>
                <p
                  onClick={handleUserClick}
                  className="text-lg font-medium cursor-pointer hover:text-black"
                >
                  Welcome, {username}
                </p>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-800 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-700 transition-all"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
