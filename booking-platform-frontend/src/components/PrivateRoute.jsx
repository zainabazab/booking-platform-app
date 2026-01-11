import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Check if token exists in localStorage
  const isAuthenticated = localStorage.getItem('token'); 

  // If authenticated, render the child route (Outlet), otherwise redirect to login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;