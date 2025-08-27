import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  if (isAuthenticated === null) {
    // Still checking authentication status, render nothing or a loading spinner
    return null; 
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
