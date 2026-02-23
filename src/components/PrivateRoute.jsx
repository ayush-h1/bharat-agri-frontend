import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SidebarLayout from './SidebarLayout';

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="loading">Loading...</div>;
  return user ? <SidebarLayout>{children}</SidebarLayout> : <Navigate to="/login" />;
}