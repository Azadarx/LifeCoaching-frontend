import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './Frontend-components/CartContext';
import AppRoutes from './routes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
