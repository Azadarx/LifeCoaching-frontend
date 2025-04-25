import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User, Settings, ChevronDown, Image } from 'lucide-react';

const UserMenu = () => {
    const { isSignedIn, isLoaded, currentUser, signout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSignOut = async () => {
        try {
            await signout();
            setIsMenuOpen(false);
            navigate('/');
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    if (!isLoaded) {
        return <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>;
    }

    if (!isSignedIn) {
        return (
            <button
                onClick={() => navigate('/signin')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                <LogIn size={18} />
                <span>Sign In</span>
            </button>
        );
    }

    // Get user initials or use default avatar
    const userInitials = currentUser?.displayName 
        ? currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase() 
        : currentUser?.email?.charAt(0).toUpperCase() || 'U';

    return (
        <div className="relative" ref={menuRef}>
            <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Open user menu"
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
            >
                {currentUser?.photoURL ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-100 hover:ring-blue-200 transition-all">
                        <img 
                            src={currentUser.photoURL} 
                            alt={currentUser.displayName || "User"} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-medium shadow-md hover:shadow-lg transition-all">
                        {userInitials}
                    </div>
                )}
                <ChevronDown size={16} className={`text-gray-600 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </div>

            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="font-medium text-gray-800">{currentUser?.displayName || 'User'}</div>
                        <div className="text-sm text-gray-500 truncate">{currentUser?.email}</div>
                    </div>
                    
                    <button 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        onClick={() => {
                            setIsMenuOpen(false);
                            navigate('/user-details');
                        }}
                    >
                        <User size={16} className="text-blue-600" />
                        <span>Your Details</span>
                    </button>
                    
                    <button 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        onClick={handleSignOut}
                    >
                        <LogOut size={16} className="text-red-500" />
                        <span>Sign out</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;