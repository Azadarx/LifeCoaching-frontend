import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import PaymentPage from './Frontend-components/PaymentPage';
import SuccessPage from './Frontend-components/SuccessPage';
import ProtectedRoute from './Frontend-components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/success" element={<SuccessPage />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
      </Route>
    </Routes>
  );
};

export default AppRoutes;