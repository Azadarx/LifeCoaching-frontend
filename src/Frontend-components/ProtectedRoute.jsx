import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // adjust path if needed

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-gray-700">Loading...</span>
      </div>
    );
  }

  // If user is not logged in
  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  // If payment is not marked as successful
  const isPaymentSuccessful = sessionStorage.getItem('paymentSuccessful') === 'true';
  if (!isPaymentSuccessful) {
    return <Navigate to="/" replace />;
  }

  // All good — render the protected children
  return <Outlet />;
};

export default ProtectedRoute;
