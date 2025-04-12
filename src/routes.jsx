import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import HeroPage from './Frontend-components/HeroPage';
import PaymentPage from './Frontend-components/PaymentPage';
import SuccessPage from './Frontend-components/SuccessPage';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';

// Protected route component using Firebase
const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-gray-700">Loading...</span>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }
  
  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HeroPage />} />
      
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;