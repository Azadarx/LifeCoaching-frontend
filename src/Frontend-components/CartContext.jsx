import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from "../AuthContext";
import { useNavigate } from 'react-router-dom';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isSignedIn, userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const hasLoadedCart = useRef(false);
  const lastUserId = useRef(null);

  const getCartKey = () => {
    if (isSignedIn && userId) return `userCart_${userId}`;
    return 'userCart_guest';
  };

  // 🧠 Load cart when user ID changes AND after auth is loaded
  useEffect(() => {
    if (!isLoaded) return;

    const cartKey = getCartKey();

    // Only reload if user actually changed
    if (hasLoadedCart.current && lastUserId.current === userId) return;

    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setItems(parsed);
          console.log('✅ Cart loaded:', cartKey);
        }
      } catch (e) {
        console.error('❌ Failed to parse cart for', cartKey);
      }
    } else {
      console.log('🆕 No cart found for', cartKey);
      setItems([]); // start fresh
    }

    hasLoadedCart.current = true;
    lastUserId.current = userId;
  }, [isLoaded, userId]);

  // 💾 Save cart when items/user change
  useEffect(() => {
    if (!hasLoadedCart.current) return;
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(items));
    console.log('💾 Cart saved:', cartKey);
  }, [items, userId]);

  const addItem = (newItem) => {
    if (!isSignedIn) {
      navigate('/signin');
      return;
    }
  
    // Check BEFORE state update
    const exists = items.some(item => item.id === newItem.id);
    if (exists) {
      console.log('🛑 Item already in cart:', newItem.id);
      return; // ⛔ Don't add or open cart
    }
  
    setItems(prevItems => [...prevItems, newItem]);
    setIsCartOpen(true); // ✅ Only open if new item is added
  };
  

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, change) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) }
          : item
      )
    );
  };

  const clearCart = () => {
    const cartKey = getCartKey();
    localStorage.removeItem(cartKey);
    setItems([]);
    setIsCartOpen(false);
    console.log('🗑️ Cart cleared:', cartKey);
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
