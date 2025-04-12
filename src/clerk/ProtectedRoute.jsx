import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import HeroPage from '../Frontend-components/HeroPage';
import PaymentPage from '../Frontend-components/PaymentPage';
import SuccessPage from '../Frontend-components/SuccessPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!isSignedIn) {
        return <Navigate to="/sign-in" replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HeroPage />} />

            <Route
                path="/sign-in/*"
                element={
                    <div className="flex items-center justify-center min-h-screen bg-gray-50">
                        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
                    </div>
                }
            />

            <Route
                path="/sign-up/*"
                element={
                    <div className="flex items-center justify-center min-h-screen bg-gray-50">
                        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
                    </div>
                }
            />

            <Route
                path="/payment"
                element={
                    <ProtectedRoute>
                        <PaymentPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/success"
                element={
                    <ProtectedRoute>
                        <SuccessPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;