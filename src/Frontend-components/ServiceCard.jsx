import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const ServiceCard = ({ service }) => {
  const { addItem, items, isSignedIn } = useCart();
  const navigate = useNavigate();
  const isInCart = items.some(item => item.id === `service-${service.id}`);

  const handleAddToCart = () => {
    if (!isSignedIn) {
      navigate('/signin');
      return;
    }

    addItem({
      id: `service-${service.id}`,
      name: service.title,
      price: service.price,
      quantity: 1,
      icon: service.icon
    });
  };

  return (
    <div className="p-6">
      <div className="text-4xl mb-4 bg-rose-50 w-16 h-16 flex items-center justify-center rounded-full mx-auto">
        {service.icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-neutral-800 text-center">{service.title}</h3>
      <p className="text-zinc-700 mb-6 text-center">{service.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-rose-600 font-bold text-xl">₹{service.price}</span>
        <button
          onClick={handleAddToCart}
          disabled={isInCart}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isInCart
              ? 'bg-gray-300 text-zinc-700 cursor-not-allowed'
              : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
        >
          {isInCart ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;