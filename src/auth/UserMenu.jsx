import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User, Settings, ChevronDown } from 'lucide-react';

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
        return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>;
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
            >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                    {userInitials}
                </div>
                <ChevronDown size={14} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </div>

            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{currentUser?.displayName || 'User'}</div>
                        <div className="text-xs text-gray-500 truncate">{currentUser?.email}</div>
                    </div>
                    <button 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={handleSignOut}
                    >
                        <LogOut size={14} />
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;