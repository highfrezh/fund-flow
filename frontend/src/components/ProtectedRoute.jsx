// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch (err) {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access');
  const isAuthenticated = token && isTokenValid(token);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
