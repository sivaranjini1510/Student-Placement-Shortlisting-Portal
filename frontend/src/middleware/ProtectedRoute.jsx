import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ role }) => {
  const { user } = useAuthContext();
  return user?.role === role ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
