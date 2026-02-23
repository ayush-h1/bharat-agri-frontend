import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminLayout from './AdminLayout';

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="loading">Loading...</div>;
  return user && user.isAdmin ? <AdminLayout>{children}</AdminLayout> : <Navigate to="/dashboard" />;
}
