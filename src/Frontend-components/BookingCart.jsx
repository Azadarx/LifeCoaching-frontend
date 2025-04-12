import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, ChevronRight, CreditCard, Trash2, LogIn } from 'lucide-react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const BookingCart = ({ className = '' }) => {
  const { items, clearCart, isSignedIn } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoaded } = useAuth();

  const getTotal = () => {
    return items.reduce((total, item) => {
      const count = item.quantity ?? item.nights ?? 1;
      return total + item.price * count;
    }, 0);
  };

  const confirmClearCart = () => {
    const confirmed = window.confirm('Are you sure you want to clear all items from your cart?');
    if (confirmed) clearCart();
  };

  const handleSignIn = () => {
    setIsOpen(false);
    navigate('/sign-in');
  };

  const handleCheckout = () => {
    if (!isSignedIn) {
      navigate('/sign-in');
    } else {
      setIsOpen(false);
      navigate('/payment');
    }
  };

  return (
    <>
      {/* Cart Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`relative ${className}`}
      >
        <ShoppingCart size={24} />
        {isSignedIn && items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed top-0 right-0 w-full max-w-sm h-full shadow-lg bg-white flex flex-col z-50 ${className}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Your Booking</h2>
              <div className="flex items-center gap-2">
                {isSignedIn && items.length > 0 && (
                  <button
                    onClick={confirmClearCart}
                    className="text-gray-500 hover:text-red-600"
                    title="Clear All"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-600">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
              {!isLoaded ? (
                <div className="text-center py-12">
                  <p>Loading...</p>
                </div>
              ) : !isSignedIn ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <LogIn size={48} className="mb-4 text-blue-600" />
                  <p className="mb-6 text-gray-600">Please sign in to view your cart</p>
                  <motion.button
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSignIn}
                  >
                    <LogIn size={18} />
                    Sign In / Sign Up
                  </motion.button>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-4">Your cart is empty</p>
                  <button
                    className="text-blue-600 flex items-center mx-auto"
                    onClick={() => setIsOpen(false)}
                  >
                    Continue Booking <ChevronRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      className="bg-white p-4 rounded-lg shadow-sm flex gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      layout
                    >
                      {item.icon ? (
                        <div className="w-20 h-20 rounded-md bg-teal-100 flex items-center justify-center text-4xl">
                          {item.icon}
                        </div>
                      ) : (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      )}

                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-blue-600 font-semibold mt-2">₹{item.price}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {isSignedIn && items.length > 0 && (
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{getTotal()}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Tax</span>
                  <span>₹{(getTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mb-4">
                  <span>Total</span>
                  <span>₹{(getTotal() * 1.1).toFixed(2)}</span>
                </div>
                <motion.button
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                >
                  <CreditCard size={18} />
                  Proceed to Checkout
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BookingCart;