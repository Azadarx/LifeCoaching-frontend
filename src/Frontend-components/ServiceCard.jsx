import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const ServiceCard = ({ service }) => {
  const { addItem, isSignedIn } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isSignedIn) {
      navigate('/sign-in');
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
      <div className="text-4xl mb-4 bg-teal-50 w-16 h-16 flex items-center justify-center rounded-full mx-auto">
        {service.icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">{service.title}</h3>
      <p className="text-gray-600 mb-6 text-center">{service.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-teal-600 font-bold text-xl">₹{service.price}</span>
        <button
          onClick={handleAddToCart}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;