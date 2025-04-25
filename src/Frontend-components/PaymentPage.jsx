import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth } from "../AuthContext";
import { CreditCard, ArrowLeft } from 'lucide-react';

// Get the backend URL from environment or use default
const BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL || 'https://lifecoaching-backend.onrender.com';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { items, clearCart } = useCart();
    const { isSignedIn, userId } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [scriptError, setScriptError] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Get cart data from location state or calculate from useCart
    const cartData = location.state || {};

    // Redirect if not signed in
    useEffect(() => {
        if (!isSignedIn) {
            navigate('/signin');
            return;
        }
    }, [isSignedIn, navigate]);

    const getCartItems = () => {
        return cartData.cartItems || items;
    };

    const getSubtotal = () => {
        if (cartData.subtotal) return cartData.subtotal;
        return getCartItems().reduce((total, item) => {
            const count = item.quantity ?? item.nights ?? 1;
            return total + item.price * count;
        }, 0);
    };

    const getTax = () => {
        if (cartData.tax) return cartData.tax;
        return getSubtotal() * 0.1;
    };

    const getTotal = () => {
        if (cartData.total) return cartData.total;
        return getSubtotal() * 1.1;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        if (!formData.fullName.trim()) {
            tempErrors.fullName = 'Full name is required';
            isValid = false;
        }

        if (!formData.email.trim()) {
            tempErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Email is invalid';
            isValid = false;
        }

        if (!formData.phone.trim()) {
            tempErrors.phone = 'Phone number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.phone.replace(/[- ]/g, ''))) {
            tempErrors.phone = 'Phone number must be 10 digits';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve, reject) => {
            if (window.Razorpay) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                setScriptLoaded(true);
                resolve();
            };
            script.onerror = () => {
                setScriptError(true);
                reject(new Error('Failed to load Razorpay script'));
            };
            document.body.appendChild(script);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Ensure Razorpay script is loaded
            await loadRazorpayScript();

            if (!window.Razorpay) {
                throw new Error('Razorpay not loaded');
            }

            // Call backend to create order
            const response = await fetch(`${BACKEND_URL}/api/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: Math.round(getTotal() * 100), // Razorpay expects amount in paise and as integer
                    currency: 'INR',
                    receipt: 'order_rcptid_' + Date.now(),
                    customerDetails: formData,
                    cartItems: getCartItems(),
                    userId: userId // Include the user ID from authentication
                }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const orderData = await response.json();

            if (!orderData.id) {
                throw new Error('Failed to create order: No order ID returned');
            }

            // Get the Razorpay key from backend rather than accessing it directly
            const keyResponse = await fetch(`${BACKEND_URL}/api/razorpay-key`);
            const keyData = await keyResponse.json();
            const razorpayKeyId = keyData.key_id;

            if (!razorpayKeyId) {
                throw new Error('Failed to get Razorpay key');
            }

            const options = {
                key: razorpayKeyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "INSPIRING SHEREEN's Life Coaching",
                description: "Cart Payment",
                order_id: orderData.id,
                handler: function (response) {
                    // On payment success
                    fetch(`${BACKEND_URL}/api/payment-success`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                            customerDetails: formData,
                            cartItems: getCartItems(),
                            amount: getTotal(),
                            userId: userId // Include user ID here too
                        }),
                    })
                        .then(res => {
                            if (!res.ok) {
                                throw new Error(`Server responded with ${res.status}`);
                            }
                            return res.json();
                        })
                        .then(data => {
                            if (data.success) {
                                // Import the handler at the top of your file
                                // import { handlePaymentSuccess } from '../utils/paymentHandlers';

                                // Clear the cart
                                clearCart();

                                // Use the payment handler to set success state and redirect
                                handlePaymentSuccess(response.razorpay_payment_id, {
                                    email: formData.email,
                                    name: formData.fullName,
                                    items: getCartItems()
                                });
                            } else {
                                throw new Error('Payment verification failed');
                            }
                        })
                        .catch(err => {
                            console.error("Payment verification failed", err);
                            alert("Payment verification failed. Please contact support.");
                            setIsSubmitting(false);
                        });
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: "#4f46e5"
                },
                modal: {
                    ondismiss: function () {
                        setIsSubmitting(false);
                    }
                }
            };

            console.log("Opening Razorpay with options:", {
                key: options.key,
                amount: options.amount,
                currency: options.currency,
                orderId: options.order_id
            });

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function (response) {
                console.error("Payment failed:", response.error);
                alert(`Payment failed: ${response.error.description}`);
                setIsSubmitting(false);
            });

            razorpay.open();

        } catch (error) {
            console.error("Payment initiation failed", error);
            alert(`Payment initiation failed: ${error.message}`);
            setIsSubmitting(false);

            // Only use fallback in development mode
            if (process.env.NODE_ENV === 'development') {
                console.log("Using development fallback...");
                setTimeout(() => {
                    clearCart();
                    navigate('/success', { state: { email: formData.email } });
                }, 2000);
            }
        }
    };

    const scrollToSection = (sectionId) => {
        setMobileMenuOpen(false);
        navigate('/');
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    useEffect(() => {
        // Load Razorpay script when component mounts
        loadRazorpayScript()
            .catch(err => {
                console.error("Failed to load Razorpay script:", err);
                setScriptError(true);
            });

        // Scroll to top when component mounts
        window.scrollTo(0, 0);

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // If cart is empty and no state was passed, redirect to home or services
    useEffect(() => {
        if (getCartItems().length === 0 && !cartData.total) {
            navigate('/services');
        }
    }, [cartData, items, navigate]);

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    if (scriptError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-indigo-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Payment System Error</h2>
                    <p className="text-gray-700 mb-6">
                        We're having trouble loading our payment system. Please try again later or contact support.
                    </p>
                    <Link to="/" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2">
                        <ArrowLeft size={16} />
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="font-sans bg-gradient-to-br from-indigo-50 to-white min-h-screen">
            {/* Navbar - Simplified */}
            <nav className={`fixed top-0 left-0 w-full z-50 py-4 transition-all duration-300 ${scrollY > 20 ? 'bg-white shadow-md' : 'bg-transparent'}`}>
                <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center"
                    >
                        <Link to="/" className="text-2xl font-bold border-rose-600">INSPIRING SHEREEN</Link>
                        <span className="ml-2 text-zinc-700 hidden md:inline">| Life Coach</span>
                    </motion.div>

                    <Link to="/"
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 container mx-auto">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-neutral-800 mb-2">Complete Your Payment</h1>
                    <p className="text-lg text-zinc-700 max-w-2xl mx-auto">Secure checkout for your selected coaching services</p>
                </motion.div>

                {/* Payment Form - Full Width */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    <div className="bg-amber-600 text-white p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <CreditCard size={24} />
                                <h2 className="text-2xl font-semibold">Complete Your Purchase</h2>
                            </div>
                            <div className="text-right">
                                <div className="text-lg">Total Amount</div>
                                <div className="text-3xl font-bold">₹{getTotal().toFixed(2)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="fullName" className="block text-gray-700 text-sm font-medium mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    placeholder="Enter your full name"
                                />
                                {errors.fullName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                        placeholder="Enter your email address"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                        placeholder="Enter your 10-digit phone number"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-indigo-50 p-6 rounded-lg">
                                <h3 className="font-semibold text-neutral-800 mb-4">Order Summary</h3>
                                {getCartItems().map((item) => (
                                    <div key={item.id} className="flex justify-between mb-3 pb-3 border-b border-indigo-100">
                                        <div>
                                            <h4 className="font-medium">{item.name}</h4>
                                            {item.quantity && <p className="text-sm text-zinc-700">Quantity: {item.quantity}</p>}
                                            {item.nights && <p className="text-sm text-zinc-700">Nights: {item.nights}</p>}
                                        </div>
                                        <span className="font-medium">₹{item.price.toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-700">Subtotal</span>
                                    <span className="font-medium">₹{getSubtotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-700">Tax (10%)</span>
                                    <span className="font-medium">₹{getTax().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-4 border-t border-indigo-200">
                                    <span>Total</span>
                                    <span className="text-indigo-700">₹{getTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-center space-x-6 mb-4">
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0tubqqOWuY630wllhqVlo4_NS1aNna-mBzA&s" alt="Visa" className="h-12 object-contain" />
                                </div>
                                <div className="text-sm text-zinc-700 text-center">
                                    <p>Your payment information is encrypted and secure</p>
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isSubmitting}
                                className="w-full py-4 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                            >
                                {isSubmitting ? (
                                    <span className="inline-flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing Payment...
                                    </span>
                                ) : (
                                    <>
                                        <CreditCard size={20} />
                                        Complete Payment - ₹{getTotal().toFixed(2)}
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </div>

            {/* Footer - Simplified */}
            <footer className="bg-gray-800 text-white py-8 mt-16">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h3 className="text-xl font-bold mb-2">INSPIRING SHEREEN LIFE COACHING</h3>
                    <p className="text-gray-300 mb-4">Professional Life Coach dedicated to helping you achieve your full potential.</p>
                    <div className="flex justify-center space-x-4 mb-4">
                        <Link to="/" className="text-white hover:text-indigo-400 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                            </svg>
                        </Link>
                        <Link to="/" className="text-white hover:text-indigo-400 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                            </svg>
                        </Link>
                        <Link to="/" className="text-white hover:text-indigo-400 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                            </svg>
                        </Link>
                    </div>
                    <p className="text-gray-400 text-sm">© 2025 . INSPIRING SHEREEN LIFE COACHING All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default PaymentPage;