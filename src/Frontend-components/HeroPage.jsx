// HeroPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import BookingCart from './BookingCart';
import UserMenu from '../clerk/UserMenu';


const HeroPage = () => {
    const { addItem } = useCart();
    const [activeSection, setActiveSection] = useState('home');
    const [scrollY, setScrollY] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);

            // Update active section based on scroll position
            const sections = ['home', 'about', 'services', 'webinars', 'contact'];
            const sectionPositions = sections.map(id => {
                const element = document.getElementById(id);
                return element ? element.offsetTop - 100 : 0;
            });

            // Find the section we're currently scrolled to
            for (let i = sectionPositions.length - 1; i >= 0; i--) {
                if (window.scrollY >= sectionPositions[i]) {
                    setActiveSection(sections[i]);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        // Add a slight delay to ensure DOM is fully rendered
        setTimeout(() => {
            const section = document.getElementById(sectionId);
            if (section) {
                window.scrollTo({
                    top: section.offsetTop - 80,
                    behavior: 'smooth'
                });
                setActiveSection(sectionId);
            } else {
                console.warn(`Section with id "${sectionId}" not found in the DOM`);
            }
        }, 100);

        setMobileMenuOpen(false);
    };

    // Handler for direct enrollment
    const handleEnrollClick = (price = 99) => {
        console.log("Enrolling with price:", price);
        try {
            navigate('/payment', {
                state: {
                    subtotal: price,
                    tax: price * 0.1,
                    total: price * 1.1,
                    cartItems: []
                }
            });
        } catch (error) {
            console.error("Navigation error:", error);
        }
    };
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Get the backend URL from environment variables or use a default
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://lifecoaching-backend.onrender.com';
            const response = await fetch(`${backendUrl}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus({ type: 'success', message: 'Thank you for your message! I\'ll get back to you soon.' });
                // Reset form on success
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                setSubmitStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again.' });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus({ type: 'error', message: 'Network error. Please check your connection and try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } // ✅ faster!
    };


    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05 // or even 0.03 for super-fast load-in

            }
        }
    };

    const services = [
        {
            id: 1,
            title: "Goal Clarification Session",
            description: "Define what you truly want in different areas of life (career, relationships, health, etc.).",
            price: 49,
            icon: "🎯"
        },
        {
            id: 2,
            title: "Action Plan Workshop",
            description: "Break your big goals into manageable steps with clear timelines.",
            price: 79,
            icon: "📝"
        },
        {
            id: 3,
            title: "Motivation Booster Program",
            description: "Stay focused, energized, and accountable throughout your journey.",
            price: 59,
            icon: "🚀"
        },
        {
            id: 4,
            title: "Obstacle Identification & Resolution",
            description: "Recognize and overcome mental blocks, fears, and limiting beliefs.",
            price: 89,
            icon: "🧗‍♀️"
        },
        {
            id: 5,
            title: "Self-Discovery Journey",
            description: "Explore your values, strengths, and passions in a guided environment.",
            price: 69,
            icon: "🔍"
        },
        {
            id: 6,
            title: "Career Transition Coaching",
            description: "Navigate career changes with confidence and strategic planning.",
            price: 99,
            icon: "💼"
        },
        {
            id: 7,
            title: "Relationship Enhancement",
            description: "Develop communication skills and emotional intelligence for better connections.",
            price: 79,
            icon: "❤️"
        },
        {
            id: 8,
            title: "Work-Life Balance Mastery",
            description: "Create sustainable practices for thriving in both personal and professional life.",
            price: 89,
            icon: "⚖️"
        }
    ];

    const webinars = [
        {
            id: 1,
            title: "Mindset Mastery: Transforming Limitations into Opportunities",
            description: "Build confidence, positivity, and resilience in this interactive live session.",
            price: 49,
            icon: "🧠"
        },
        {
            id: 2,
            title: "Productivity Powerhouse: Getting Things Done With Purpose",
            description: "Improve time management, prioritization, and goal-setting skills.",
            price: 59,
            icon: "⏱️"
        },
        {
            id: 3,
            title: "Progress Tracking System: Measuring What Matters",
            description: "Learn effective methods to track achievements and adjust strategies when needed.",
            price: 39,
            icon: "📊"
        },
        {
            id: 4,
            title: "Emotional Intelligence: The Key to Personal & Professional Success",
            description: "Develop awareness, regulation, and empathetic connection in all relationships.",
            price: 69,
            icon: "🔑"
        },
        {
            id: 5,
            title: "The Resilience Blueprint: Thriving Through Adversity",
            description: "Build mental toughness and adaptability for life's inevitable challenges.",
            price: 55,
            icon: "🛡️"
        },
        {
            id: 6,
            title: "Purpose-Driven Life Design: Creating Your Authentic Path",
            description: "Align your daily actions with your deepest values and vision.",
            price: 75,
            icon: "🧭"
        }
    ];

    return (
        <div className="font-sans bg-white">
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 w-full z-50 py-4 transition-all duration-300 ${scrollY > 20 ? 'bg-white shadow-md' : 'bg-transparent'}`}>
                <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center"
                    >
                        <span className="text-2xl font-bold text-teal-600 capitalize">INSPIRING SHEREEN
                        </span>
                        <span className="ml-2 text-gray-600 hidden md:inline">| Life Coach</span>
                    </motion.div>

                    <div className="hidden md:flex space-x-6 items-center">
                        {['home', 'about', 'services', 'webinars', 'contact'].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item)}
                                className={`${activeSection === item
                                    ? 'text-teal-600 font-medium border-b-2 border-teal-500'
                                    : 'text-gray-600 hover:text-teal-600'
                                    } px-1 py-1 transition-all duration-300`}
                            >
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </button>
                        ))}

                        {/* 🛒 Booking Cart */}
                        <BookingCart className="text-gray-600 hover:text-teal-600 transition duration-300" />

                        {/* User Menu or Enroll Now depending on auth state */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleEnrollClick(99)}
                                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Enroll Now
                            </button>

                            {/* 👤 User Auth Menu */}
                            <UserMenu />
                        </div>

                    </div>


                    {/* Mobile menu button */}
                    {/* 👤 UserMenu & 🛒 Cart icon on small screens */}
                    <div className="md:hidden flex items-center gap-3">
                        <BookingCart className="text-gray-600 hover:text-teal-600 transition duration-300" />
                        <UserMenu />

                        {/* Hamburger menu */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-600 focus:outline-none"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                                ></path>
                            </svg>
                        </button>
                    </div>

                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="md:hidden bg-white shadow-lg"
                    >
                        <div className="container mx-auto px-4 py-3">
                            {['home', 'about', 'services', 'webinars', 'contact'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item)}
                                    className={`${activeSection === item
                                        ? 'text-teal-600 font-medium'
                                        : 'text-gray-600'
                                        } block w-full text-left py-3 border-b border-gray-100`}
                                >
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                </button>
                            ))}
                            <button
                                onClick={() => handleEnrollClick(99)}
                                className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white py-3 mt-3 rounded-lg font-medium"
                            >
                                Enroll Now
                            </button>
                        </div>
                    </motion.div>
                )}
            </nav>
            {/* ✅ Floating Enroll Button */}
            {/* 🚀 Enroll + Chat Buttons - Centered Bottom */}
            <motion.div
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 hidden md:flex flex-row gap-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
            >
                {/* ✨ Enroll Button */}
                <button
                    onClick={() => handleEnrollClick(99)}
                    className="group bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-4 rounded-2xl font-medium flex items-center gap-3 shadow-lg hover:shadow-teal-200/50 transition-all duration-300"
                >
                    <div className="flex justify-center items-center w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm transition-transform group-hover:rotate-12">
                        <span className="text-2xl">✨</span>
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-base font-bold tracking-wide">Enroll Now</span>
                        <span className="text-xs text-teal-100">Limited Seats</span>
                    </div>
                </button>

                {/* 💬 WhatsApp Button */}
                <a
                    href="https://wa.me/919951611674"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-2xl font-medium flex items-center gap-3 shadow-lg hover:shadow-green-200/50 transition-all duration-300"
                >
                    <div className="flex justify-center items-center w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm transition-transform group-hover:rotate-12">
                        <span className="text-2xl">💬</span>
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-base font-bold tracking-wide">Chat Now</span>
                        <span className="text-xs text-green-100">Get Support</span>
                    </div>
                </a>
            </motion.div>



            {/* Hero Section */}
            <section id="home" className="pt-24 pb-20 md:pt-32 md:pb-24 bg-gradient-to-b from-teal-50 to-white">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row items-center">
                        <motion.div
                            className="md:w-1/2 mb-10 md:mb-0"
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                        >
                            <motion.h1
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
                                variants={fadeIn}
                            >
                                Shaping Lives with <span className="text-teal-600">Holistic Success
                                </span>
                            </motion.h1>
                            <motion.p
                                className="mt-6 text-lg text-gray-600 md:max-w-md"
                                variants={fadeIn}
                            >
                                Discover your potential and achieve your dreams with Inspiring Shereen
                                ,
                                a professional life coach dedicated to your personal growth and success.
                            </motion.p>
                            <motion.div
                                className="mt-8 flex flex-wrap gap-4"
                                variants={fadeIn}
                            >
                                <button
                                    onClick={() => handleEnrollClick(99)}
                                    className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    Start Your Journey
                                </button>
                                <button
                                    onClick={() => scrollToSection('services')}
                                    className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-lg font-medium transition-all duration-300"
                                >
                                    Explore Services
                                </button>
                            </motion.div>
                        </motion.div>
                        <motion.div
                            className="md:w-1/2 flex justify-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="relative w-full max-w-md">
                                <div className="absolute inset-0 bg-teal-100 rounded-full transform scale-105 -rotate-6"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80"
                                    alt="Professional Life Coach"
                                    className="relative z-10 rounded-full w-full h-full object-cover shadow-xl"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={staggerContainer}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <motion.h2
                            variants={fadeIn}
                            className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
                        >
                            About <span className="text-teal-600">Inspiring Shereen
                            </span>
                        </motion.h2>
                        <motion.div
                            variants={fadeIn}
                            className="w-20 h-1 bg-teal-500 mx-auto mb-8"
                        ></motion.div>
                        <motion.p
                            variants={fadeIn}
                            className="text-lg text-gray-600 mb-8"
                        >
                            With over 15 years of experience in life coaching, Inspiring Shereen
                            has helped thousands
                            of individuals transform their lives, overcome obstacles, and achieve their dreams.
                            Her approach combines practical strategies with deep emotional intelligence to create
                            lasting positive change.
                        </motion.p>
                        <motion.div
                            variants={fadeIn}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
                        >
                            <div className="bg-teal-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                <div className="text-3xl mb-4">🎓</div>
                                <h3 className="text-xl font-semibold mb-2 text-teal-700">Certified Coach</h3>
                                <p className="text-gray-600">International Coaching Federation certified with advanced training</p>
                            </div>
                            <div className="bg-teal-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                <div className="text-3xl mb-4">💼</div>
                                <h3 className="text-xl font-semibold mb-2 text-teal-700">15+ Years Experience</h3>
                                <p className="text-gray-600">Thousands of successful client transformations</p>
                            </div>
                            <div className="bg-teal-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                <div className="text-3xl mb-4">🌟</div>
                                <h3 className="text-xl font-semibold mb-2 text-teal-700">Personalized Approach</h3>
                                <p className="text-gray-600">Customized strategies for your unique journey</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.h2
                            variants={fadeIn}
                            className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
                        >
                            <span className="text-teal-600">Services</span> Designed For You
                        </motion.h2>
                        <motion.div
                            variants={fadeIn}
                            className="w-20 h-1 bg-teal-500 mx-auto mb-8"
                        ></motion.div>
                        <motion.p
                            variants={fadeIn}
                            className="text-lg text-gray-600 max-w-2xl mx-auto"
                        >
                            My coaching services are designed to address every aspect of personal growth
                            and development. Choose the path that resonates most with your current needs.
                        </motion.p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: index * 0.1, duration: 0.5 }
                                    }
                                }}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="p-6">
                                    <div className="text-4xl mb-4 bg-teal-50 w-16 h-16 flex items-center justify-center rounded-full mx-auto">{service.icon}</div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">{service.title}</h3>
                                    <p className="text-gray-600 mb-6 text-center">{service.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-teal-600 font-bold text-xl">₹{service.price}</span>
                                        <button
                                            onClick={() =>
                                                addItem({
                                                    id: `service-${service.id}`,
                                                    name: service.title,
                                                    price: service.price,
                                                    quantity: 1,
                                                    icon: service.icon
                                                })
                                            }
                                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Webinars Section */}
            <section id="webinars" className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.h2
                            variants={fadeIn}
                            className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
                        >
                            Live <span className="text-teal-600">Webinars</span> & Workshops
                        </motion.h2>
                        <motion.div
                            variants={fadeIn}
                            className="w-20 h-1 bg-teal-500 mx-auto mb-8"
                        ></motion.div>
                        <motion.p
                            variants={fadeIn}
                            className="text-lg text-gray-600 max-w-2xl mx-auto"
                        >
                            Join our live interactive webinars to learn, grow, and connect with a community
                            of like-minded individuals on a similar journey of self-improvement.
                        </motion.p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {webinars.map((webinar, index) => (
                            <motion.div
                                key={webinar.id}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={{
                                    hidden: { opacity: 0, scale: 0.9 },
                                    visible: {
                                        opacity: 1,
                                        scale: 1,
                                        transition: { delay: index * 0.1, duration: 0.5 }
                                    }
                                }}
                                className="bg-gradient-to-br from-teal-50 to-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="p-8">
                                    <div className="text-4xl mb-4 bg-white w-16 h-16 flex items-center justify-center rounded-full mx-auto shadow-sm">
                                        {webinar.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">{webinar.title}</h3>
                                    <p className="text-gray-600 mb-6 text-center">{webinar.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-teal-600 font-bold text-xl">₹{webinar.price}</span>
                                        <button
                                            onClick={() =>
                                                addItem({
                                                    id: `webinar-${webinar.id}`,
                                                    name: webinar.title,
                                                    price: webinar.price,
                                                    quantity: 1,
                                                    image: "/api/placeholder/100/100"
                                                })
                                            }
                                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeIn}
                        className="text-center mt-12"
                    >
                        <button
                            onClick={() =>
                                addItem({
                                    id: "all-webinars",
                                    name: "Access to All Webinars",
                                    price: 149,
                                    quantity: 1,
                                    image: "/api/placeholder/100/100"
                                })
                            }
                            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
                        >
                            Get Access to All Webinars (₹149)
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.h2
                            variants={fadeIn}
                            className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
                        >
                            Success <span className="text-teal-600">Stories</span>
                        </motion.h2>
                        <motion.div
                            variants={fadeIn}
                            className="w-20 h-1 bg-teal-500 mx-auto mb-8"
                        ></motion.div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        <motion.div
                            variants={fadeIn}
                            className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex items-center mb-4">
                                <img src="/api/placeholder/60/60" alt="Client" className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <h4 className="font-bold text-gray-800">Priya Sharma</h4>
                                    <p className="text-gray-500 text-sm">Marketing Professional</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "Inspiring Shereen
                                helped me identify the mental blocks that were holding me back in my career.
                                Within 3 months of coaching, I received a promotion I had been working toward for years!"
                            </p>
                            <div className="mt-4 text-yellow-400">★★★★★</div>
                        </motion.div>

                        <motion.div
                            variants={fadeIn}
                            className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex items-center mb-4">
                                <img src="/api/placeholder/60/60" alt="Client" className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <h4 className="font-bold text-gray-800">Rahul Mehta</h4>
                                    <p className="text-gray-500 text-sm">Software Engineer</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "The goal-setting framework Inspiring Shereen
                                taught me completely changed how I approach both work and personal goals.
                                I've accomplished more in the past 6 months than in the previous 2 years."
                            </p>
                            <div className="mt-4 text-yellow-400">★★★★★</div>
                        </motion.div>

                        <motion.div
                            variants={fadeIn}
                            className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex items-center mb-4">
                                <img src="/api/placeholder/60/60" alt="Client" className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <h4 className="font-bold text-gray-800">Anjali Patel</h4>
                                    <p className="text-gray-500 text-sm">Small Business Owner</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "When I was on the verge of giving up my business, Inspiring Shereen helped me reconnect with my purpose and
                                passion. Her coaching not only saved my business but helped it flourish beyond my expectations."
                            </p>
                            <div className="mt-4 text-yellow-400">★★★★★</div>

                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.h2
                            variants={fadeIn}
                            className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
                        >
                            Get in <span className="text-teal-600">Touch</span>
                        </motion.h2>
                        <motion.div
                            variants={fadeIn}
                            className="w-20 h-1 bg-teal-500 mx-auto mb-8"
                        ></motion.div>
                        <motion.p
                            variants={fadeIn}
                            className="text-lg text-gray-600 max-w-2xl mx-auto"
                        >
                            Have questions or ready to start your journey? Reach out to me directly.
                            I'm here to help you achieve your goals and transform your life.
                        </motion.p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-wrap -mx-4">
                            <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                    variants={fadeIn}
                                    className="bg-gray-50 p-8 rounded-xl h-full"
                                >
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>

                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4 text-teal-600">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">Phone</p>
                                            <a href="tel:+919951611674" className="text-gray-800 font-medium hover:text-teal-600 transition-colors">+91 99516 11674</a>
                                        </div>
                                    </div>

                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4 text-teal-600">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">Email</p>
                                            <a href="mailto:phonicswithshereen@gmail.com" className="text-gray-800 font-medium hover:text-teal-600 transition-colors">phonicswithshereen@gmail.com</a>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4 text-teal-600">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">Location</p>
                                            <p className="text-gray-800 font-medium">Available for online sessions worldwide</p>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <h4 className="text-lg font-bold text-gray-800 mb-4">Follow Me</h4>
                                        <div className="flex space-x-4">
                                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                                </svg>
                                            </a>
                                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                            </a>
                                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="w-full md:w-1/2 px-4">
                                <motion.form
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                    variants={fadeIn}
                                    className="bg-white p-8 rounded-xl shadow-md"
                                    onSubmit={handleSubmit}
                                >
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Send a Message</h3>

                                    {submitStatus && (
                                        <div className={`mb-6 p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {submitStatus.message}
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Your Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="How can I help you?"
                                            required
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                                        <textarea
                                            id="message"
                                            rows="5"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="Tell me about your goals..."
                                            required
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </motion.form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.h2
                            variants={fadeIn}
                            className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
                        >
                            Frequently <span className="text-teal-600">Asked Questions</span>
                        </motion.h2>
                        <motion.div
                            variants={fadeIn}
                            className="w-20 h-1 bg-teal-500 mx-auto mb-8"
                        ></motion.div>
                    </motion.div>

                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={staggerContainer}
                            className="space-y-6"
                        >
                            <motion.div
                                variants={fadeIn}
                                className="bg-white p-6 rounded-xl shadow-md"
                            >
                                <h3 className="text-xl font-bold text-gray-800 mb-2">How are coaching sessions conducted?</h3>
                                <p className="text-gray-600">
                                    All coaching sessions are conducted online via Zoom or Google Meet. This allows for flexibility
                                    and accessibility regardless of your location. Sessions typically last 60 minutes.
                                </p>
                            </motion.div>

                            <motion.div
                                variants={fadeIn}
                                className="bg-white p-6 rounded-xl shadow-md"
                            >
                                <h3 className="text-xl font-bold text-gray-800 mb-2">How many sessions will I need?</h3>
                                <p className="text-gray-600">
                                    This varies depending on your goals and circumstances. Most clients see significant progress
                                    within 6-8 sessions. We'll discuss your specific needs during our initial consultation.
                                </p>
                            </motion.div>

                            <motion.div
                                variants={fadeIn}
                                className="bg-white p-6 rounded-xl shadow-md"
                            >
                                <h3 className="text-xl font-bold text-gray-800 mb-2">What's your cancellation policy?</h3>
                                <p className="text-gray-600">
                                    I understand that life happens. Sessions can be rescheduled with at least 24 hours notice
                                    at no additional cost. Cancellations with less than 24 hours notice may incur a fee.
                                </p>
                            </motion.div>

                            <motion.div
                                variants={fadeIn}
                                className="bg-white p-6 rounded-xl shadow-md"
                            >
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Are coaching sessions confidential?</h3>
                                <p className="text-gray-600">
                                    Absolutely. I maintain strict confidentiality about all aspects of our coaching relationship.
                                    Your privacy and trust are paramount to effective coaching.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                        <div className="mb-6 md:mb-0">
                            <h2 className="text-2xl font-bold text-teal-400">Inspiring Shereen
                            </h2>
                            <p className="text-gray-400 mt-2">Professional Life Coach</p>
                        </div>

                        <div className="flex space-x-6">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-8 pb-4">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400 mb-4 md:mb-0">© {new Date().getFullYear()} Inspiring Shereen
                                . All rights reserved.</p>
                            <div className="flex space-x-6">
                                <Link to="/privacy-policy" className="text-gray-400 hover:text-teal-400 transition-colors">Privacy Policy</Link>
                                <Link to="/terms-of-service" className="text-gray-400 hover:text-teal-400 transition-colors">Terms of Service</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div >
    );
};

export default HeroPage;