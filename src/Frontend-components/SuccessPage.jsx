import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Home, Calendar } from 'lucide-react';

const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';

    useEffect(() => {
        // If no email in state, redirect to home
        if (!email) {
            setTimeout(() => navigate('/'), 3000);
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }, [email, navigate]);

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerItems = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="font-sans bg-gradient-to-br from-indigo-50 to-white min-h-screen">
            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 container mx-auto">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="max-w-3xl mx-auto"
                >
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-indigo-600 text-white p-8 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                className="inline-block mb-4"
                            >
                                <CheckCircle size={80} strokeWidth={1.5} />
                            </motion.div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Payment Successful!</h1>
                            <p className="text-lg opacity-90">Thank you for your purchase</p>
                        </div>

                        <div className="p-8">
                            <motion.div variants={staggerItems} initial="hidden" animate="visible" className="space-y-6">
                                <motion.div variants={fadeInUp} className="bg-green-50 p-6 rounded-lg border border-green-100 text-center">
                                    <p className="text-gray-700 mb-2">A confirmation email has been sent to:</p>
                                    <p className="text-lg font-semibold text-indigo-700">{email}</p>
                                </motion.div>

                                <motion.div variants={fadeInUp} className="bg-indigo-50 p-6 rounded-lg">
                                    <h3 className="font-medium text-gray-800 mb-4 text-lg">What happens next?</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <div className="bg-indigo-100 p-2 rounded-full mr-3 mt-1">
                                                <Calendar size={18} className="text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-gray-700">Mrs. Shereen will contact you within 24 hours to schedule your session.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="bg-indigo-100 p-2 rounded-full mr-3 mt-1">
                                                <svg className="w-4.5 h-4.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-gray-700">You'll receive all necessary materials and instructions for your session.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </motion.div>

                                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Link to="/" className="flex-1">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Home size={18} />
                                            <span>Return Home</span>
                                        </motion.button>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SuccessPage;