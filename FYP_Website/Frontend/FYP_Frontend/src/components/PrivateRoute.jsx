import { Navigate, useLocation } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const roles = JSON.parse(localStorage.getItem('roles') || "[]");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} />;
  }

  if (roles.includes('admin')) {
    return children; // Admin has access to the protected component
  }

  if (roles.includes('user')) {
    if (location.pathname !== '/user-panel') {
      return <Navigate to="/" state={{ from: location }} />;
    }
    return children; // Allow access if already navigating to /user-panel
  }

  // Default redirect for invalid or no roles
  return <Navigate to="/" state={{ from: location }} />;
};

export default PrivateRoute;