import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-base">
        <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-base px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-content-main mb-2">Access Restricted</h2>
        <p className="text-xs text-content-muted max-w-sm mb-6">
          Your current account role ({user?.role || 'user'}) is not authorized to access this resource.
        </p>
        <Navigate to="/dashboard" replace />
      </div>
    );
  }

  return children;
};
