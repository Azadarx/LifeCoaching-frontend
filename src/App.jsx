import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { CartProvider } from "./Frontend-components/CartContext";
import AppRoutes from './clerk/ProtectedRoute';

// Replace with your actual publishable key from Clerk dashboard
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_YOUR_DEFAULT_KEY";
console.log("Clerk key:", CLERK_PUBLISHABLE_KEY);


function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;