import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadMedia } from '../utils/firebaseUploader';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        imageUrl: '',
        coverImageUrl: '',
        location: 'Galle District, Southern Province'
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [previewCoverImage, setPreviewCoverImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bioError, setBioError] = useState('');
    const [isPageLoading, setIsPageLoading] = useState(true);

    const MAX_BIO_LENGTH = 500; // Maximum characters allowed for bio

    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    const email = JSON.parse(localStorage.getItem("user"))?.email;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:8070/api/user/email/${email}`);
                const data = await res.json();
                setFormData(prev => ({
                    ...prev,
                    ...data,
                    location: data.location || prev.location
                }));
                setPreviewImage(data.imageUrl);
                setPreviewCoverImage(data.coverImageUrl);
            } catch (err) {
                console.error('Failed to load user data', err);
            } finally {
                // Add a small delay for smooth transition
                setTimeout(() => {
                    setIsPageLoading(false);
                }, 300);
            }
        };

        fetchUser();
    }, [email]);

    const handleChange = async (e) => {
        const { name, value, files } = e.target;

        if (name === 'bio') {
            if (value.length > MAX_BIO_LENGTH) {
                setBioError(`Bio must not exceed ${MAX_BIO_LENGTH} characters`);
                return;
            }
            if (value.trim().length < 10 && value.trim().length > 0) {
                setBioError('Bio must be at least 10 characters long');
            } else {
                setBioError('');
            }
        }

        if ((name === 'imageUrl' || name === 'coverImageUrl') && files?.[0]) {
            try {
                setIsUploading(true);

                // Create a preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (name === 'imageUrl') {
                        setPreviewImage(reader.result);
                    } else {
                        setPreviewCoverImage(reader.result);
                    }
                };
                reader.readAsDataURL(files[0]);

                // Upload to Firebase
                const imageUrl = await uploadMedia(files[0], userId);

                setFormData(prev => ({ ...prev, [name]: imageUrl }));
                setIsUploading(false);
            } catch (error) {
                console.error('Failed to upload image:', error);
                alert('Failed to upload image. Please try again.');
                setIsUploading(false);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate bio before submission
        if (formData.bio.trim() && formData.bio.trim().length < 10) {
            setBioError('Bio must be at least 10 characters long');
            return;
        }

        if (formData.bio.length > MAX_BIO_LENGTH) {
            setBioError(`Bio must not exceed ${MAX_BIO_LENGTH} characters`);
            return;
        }

        if (isUploading) {
            alert('Please wait for image upload to complete');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch(`http://localhost:8070/api/user/update/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Update failed');

            // Update local storage with only essential user data
            const userData = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({
                ...userData,
                id: userId,
                name: formData.name,
                email: formData.email,
                imageUrl: formData.imageUrl,
                coverImageUrl: formData.coverImageUrl,
                bio: formData.bio
            }));

            alert('Profile updated successfully');
            navigate('/profile');
        } catch (err) {
            console.error(err);
            alert('Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {isPageLoading ? (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 relative animate-spin">
                            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-indigo-200 opacity-20"></div>
                            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-pulse"></div>
                        </div>
                        <p className="text-indigo-600 font-medium animate-pulse">Loading profile...</p>
                    </div>
                </div>
            ) : (
                <div className="animate-fadeIn">
                    {/* Cover Image Section */}
                    <div className="h-48 sm:h-64 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden transition-all duration-300">
                        {previewCoverImage && (
                            <img
                                src={previewCoverImage}
                                alt="Cover"
                                className="w-full h-full object-cover absolute inset-0 transition-opacity duration-300"
                            />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                        <label className="absolute right-4 bottom-4 bg-white bg-opacity-90 p-3 rounded-full cursor-pointer hover:bg-opacity-100 transition-all duration-200 shadow-lg">
                            <input
                                type="file"
                                name="coverImageUrl"
                                accept="image/*"
                                onChange={handleChange}
                                className="hidden"
                            />
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </label>
                    </div>

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative -mt-16">
                            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                                <div className="flex flex-col items-center space-y-6">
                                    {/* Profile Image */}
                                    <div className="relative group">
                                        <img
                                            src={previewImage || 'https://via.placeholder.com/150'}
                                            alt="Profile Preview"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                                            <input
                                                type="file"
                                                name="imageUrl"
                                                accept="image/*"
                                                onChange={handleChange}
                                                className="hidden"
                                            />
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </label>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {/* Name */}
                                            <div className="col-span-2 sm:col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="col-span-2 sm:col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            {/* Location */}
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            {/* Bio */}
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                                                <div className="relative">
                                                    <textarea
                                                        name="bio"
                                                        rows="4"
                                                        className={`w-full px-4 py-2 border ${bioError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                                                        value={formData.bio || ''}
                                                        onChange={handleChange}
                                                        placeholder="Tell us about yourself... (minimum 10 characters)"
                                                    />
                                                    <div className="flex justify-between mt-1">
                                                        <span className={`text-sm ${bioError ? 'text-red-500' : 'text-gray-500'}`}>
                                                            {bioError || `${formData.bio?.length || 0}/${MAX_BIO_LENGTH} characters`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                            <button
                                                type="submit"
                                                disabled={isUploading || isSubmitting}
                                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
                                            >
                                                {(isUploading || isSubmitting) ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                        <span>{isUploading ? 'Uploading...' : 'Saving...'}</span>
                                                    </div>
                                                ) : (
                                                    'Save Changes'
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => navigate('/profile')}
                                                disabled={isSubmitting}
                                                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Add custom animation classes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
    }
`;
document.head.appendChild(style);

export default EditProfilePage;
