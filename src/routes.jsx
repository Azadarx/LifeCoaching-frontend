import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import HeroPage from './Frontend-components/HeroPage';
import PaymentPage from './Frontend-components/PaymentPage';
import SuccessPage from './Frontend-components/SuccessPage';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import ProtectedRoute from './Frontend-components/ProtectedRoute';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HeroPage />} />

      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/payment" element={<PaymentPage />} />
        <Route
          path="/success"
          element={<ProtectedRoute element={<SuccessPage />} />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;