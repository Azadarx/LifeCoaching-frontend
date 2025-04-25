import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HeroPage from './Frontend-components/HeroPage';
import ServiceCard from './Frontend-components/ServiceCard';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import PaymentPage from './Frontend-components/PaymentPage';
import SuccessPage from './Frontend-components/SuccessPage';
import ProtectedRoute from './Frontend-components/ProtectedRoute';
import UserDetails from './auth/UserDetails';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HeroPage />} />
      <Route path="/services" element={<ServiceCard />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route
        path="/user-details"
        element={
          <UserDetails />
        }
      />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
      </Route>
    </Routes>
  );
};

export default AppRoutes;