import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const CartCheckout = () => {
  const { items, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length > 0) {
      navigate('/payment', { 
        state: { 
          cartItems: items,
          subtotal: total,
          tax: total * 0.1,
          total: total * 1.1
        } 
      });
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleCheckout}
        disabled={items.length === 0}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
          items.length === 0
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartCheckout;