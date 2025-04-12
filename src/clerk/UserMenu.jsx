import React, { useState } from 'react';
import { UserButton, useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ChevronDown } from 'lucide-react';

const UserMenu = () => {
    const { isSignedIn, isLoaded } = useAuth();
    const { user } = useUser();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (!isLoaded) {
        return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>;
    }

    if (!isSignedIn) {
        return (
            <button
                onClick={() => navigate('/sign-in')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                <LogIn size={18} />
                <span>Sign In</span>
            </button>
        );
    }

    return (
        <div className="relative">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <UserButton />
            </div>
        </div>
    );
};

export default UserMenu;