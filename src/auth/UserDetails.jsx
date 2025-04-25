import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { cloudinaryConfig } from '../cloudinary';
import { Camera, Save, ArrowLeft, Loader, RefreshCw, User } from 'lucide-react';

const UserDetails = () => {
    const { currentUser, isSignedIn } = useAuth();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [photoUploading, setPhotoUploading] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    
    // Form fields
    const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Redirect if not signed in
        if (!isSignedIn) {
            navigate('/signin');
        }
    }, [isSignedIn, navigate]);

    useEffect(() => {
        // Reset form when user changes
        if (currentUser) {
            setDisplayName(currentUser.displayName || '');
            setEmail(currentUser.email || '');
            setPhotoURL(currentUser.photoURL || '');
        }
    }, [currentUser]);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please select a valid image file (JPEG, PNG, GIF, or WEBP)');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('Image size should be less than 5MB');
            return;
        }
        
        try {
            setPhotoUploading(true);
            setError('');
            
            // Create a FormData object to upload to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', cloudinaryConfig.uploadPreset);
            formData.append('folder', `profile_photos/${currentUser.uid}`);
            formData.append('public_id', `profile_${Date.now()}`);
            
            // Upload to Cloudinary
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error('Failed to upload image to Cloudinary');
            }
            
            const data = await response.json();
            const downloadURL = data.secure_url;
            
            // Update user profile
            await updateProfile(currentUser, { photoURL: downloadURL });
            
            // Update local state
            setPhotoURL(downloadURL);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Error uploading photo:', err);
            setError('Failed to upload profile photo. Please try again.');
        } finally {
            setPhotoUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);
        
        try {
            // Update display name if changed
            if (displayName !== currentUser.displayName) {
                await updateProfile(currentUser, { displayName });
            }
            
            // Update email if changed
            if (email !== currentUser.email) {
                // Email change requires recent authentication
                if (!currentPassword) {
                    setError('Please enter your current password to change your email');
                    setLoading(false);
                    return;
                }
                
                const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
                await reauthenticateWithCredential(currentUser, credential);
                await updateEmail(currentUser, email);
            }
            
            // Update password if provided
            if (showPasswordFields && newPassword) {
                if (newPassword !== confirmPassword) {
                    setError('New passwords do not match');
                    setLoading(false);
                    return;
                }
                
                if (!currentPassword) {
                    setError('Please enter your current password to change your password');
                    setLoading(false);
                    return;
                }
                
                const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
                await reauthenticateWithCredential(currentUser, credential);
                await updatePassword(currentUser, newPassword);
                
                // Clear password fields
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setShowPasswordFields(false);
            }
            
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Error updating profile:', err);
            if (err.code === 'auth/wrong-password') {
                setError('Incorrect current password');
            } else if (err.code === 'auth/weak-password') {
                setError('New password is too weak. It should be at least 6 characters');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('This email is already in use by another account');
            } else {
                setError(`Failed to update profile: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center text-rose-600 mb-6 hover:text-rose-800 transition-colors"
            >
                <ArrowLeft size={16} className="mr-1" /> Back
            </button>
            
            <h1 className="text-2xl font-bold mb-6">Your Account Details</h1>
            
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4">
                        {photoURL ? (
                            <div className="w-24 h-24 rounded-full overflow-hidden">
                                <img 
                                    src={photoURL} 
                                    alt={displayName || "User"} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white text-2xl font-medium">
                                {displayName ? displayName.charAt(0).toUpperCase() : 
                                 email ? email.charAt(0).toUpperCase() : <User size={48} />}
                            </div>
                        )}
                        
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            disabled={photoUploading}
                            className="absolute bottom-0 right-0 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-2 shadow-md transition-colors"
                            aria-label="Upload profile photo"
                        >
                            {photoUploading ? <Loader size={16} className="animate-spin" /> : <Camera size={16} />}
                        </button>
                        
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handlePhotoUpload}
                            accept="image/jpeg, image/png, image/gif, image/webp"
                            className="hidden"
                        />
                    </div>
                    
                    <div className="text-gray-500 text-sm text-center">
                        Click the camera icon to upload a profile photo
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                            Profile updated successfully!
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="displayName">
                            Full Name
                        </label>
                        <input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                            placeholder="Your name"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                            placeholder="email@example.com"
                        />
                    </div>
                    
                    {(email !== currentUser?.email || showPasswordFields) && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="currentPassword">
                                Current Password (required for security)
                            </label>
                            <input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                placeholder="••••••••"
                            />
                        </div>
                    )}
                    
                    {!showPasswordFields ? (
                        <button
                            type="button"
                            onClick={() => setShowPasswordFields(true)}
                            className="text-rose-600 hover:text-rose-800 text-sm font-medium flex items-center"
                        >
                            <RefreshCw size={14} className="mr-1" /> Change password
                        </button>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="newPassword">
                                    New Password
                                </label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                    placeholder="New password"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                                    Confirm New Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            
                            <button
                                type="button"
                                onClick={() => setShowPasswordFields(false)}
                                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                            >
                                Cancel password change
                            </button>
                        </>
                    )}
                    
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader size={16} className="animate-spin mr-2" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={16} className="mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserDetails;