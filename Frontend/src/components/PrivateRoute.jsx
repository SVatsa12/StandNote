// The NEW and CORRECT version for the wrapper route
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // 1. Import Outlet

const PrivateRoute = () => {
  const token = localStorage.getItem('token');

  // 2. If the user is authenticated, render the <Outlet />.
  // The <Outlet /> is a placeholder that will be filled by either the
  // <Dashboard /> or <Profile /> component, depending on the URL.
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;