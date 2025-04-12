import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  // Get the cart storage key specific to this user
  const getCartKey = () => {
    return `userCart_${userId || 'guest'}`;
  };

  // Cart items state
  const [items, setItems] = useState([]);

  // Cart visibility state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart when auth state changes or user ID is available
  useEffect(() => {
    if (isSignedIn && userId) {
      const cartKey = getCartKey();
      const savedCart = localStorage.getItem(cartKey);
      
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
          setItems([]);
        }
      } else {
        // No saved cart for this user, start with empty cart
        setItems([]);
      }
    } else {
      // User is not signed in, clear the cart
      setItems([]);
    }
  }, [isSignedIn, userId]);

  // Save cart to localStorage when items change
  useEffect(() => {
    if (isSignedIn && userId) {
      const cartKey = getCartKey();
      localStorage.setItem(cartKey, JSON.stringify(items));
    }
  }, [items, isSignedIn, userId]);

  // Add or update item in cart
  const addItem = (newItem) => {
    if (!isSignedIn) {
      navigate('/sign-in');
      return;
    }

    setItems(prevItems => {
      const existing = prevItems.find(item => item.id === newItem.id);
      if (existing) {
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: (item.quantity || 1) + (newItem.quantity || 1) }
            : item
        );
      }
      return [...prevItems, newItem];
    });

    setIsCartOpen(true); // Auto open cart
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, change) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, (item.quantity || 1) + change);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    if (isSignedIn && userId) {
      localStorage.removeItem(getCartKey());
    }
    setIsCartOpen(false);
  };

  const toggleCart = () => setIsCartOpen(prev => !prev);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        toggleCart,
        isSignedIn,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);