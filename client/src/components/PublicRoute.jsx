import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  if (loading) {
    // Still checking authentication status, render nothing or a loading spinner
    return <h2>Loading...</h2>; 
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
