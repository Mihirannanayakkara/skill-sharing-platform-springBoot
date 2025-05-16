import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBookmark } from 'react-icons/fa';
import Navbar from '../components/NavBar';
import ProfileSidebar from '../components/ProfileSidebar';

const SavedItemsPage = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchSavedPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8070/api/saved/posts?userId=${currentUser.id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch saved posts');
            }

            const posts = await response.json();
            setSavedPosts(posts);
        } catch (error) {
            console.error('Error fetching saved posts:', error);
            setSavedPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser?.id) {
            fetchSavedPosts();
        }
    }, [currentUser?.id]);

    const handleUnsave = async (postId) => {
        try {
            const response = await fetch(`http://localhost:8070/api/saved/toggle?userId=${currentUser.id}&postId=${postId}`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Failed to unsave post');
            }

            // Refresh the posts to ensure consistency
            fetchSavedPosts();
        } catch (error) {
            console.error('Error unsaving post:', error);
        }
    };

    if (!currentUser?.id) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold text-gray-900">Please log in to view saved items</h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex gap-6">
                    {/* Left Sidebar */}
                    <div className="w-80 flex-shrink-0 hidden lg:block">
                        <div className="sticky top-24">
                            <ProfileSidebar user={currentUser} />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <FaBookmark className="text-blue-600 text-xl" />
                                    <h1 className="text-2xl font-semibold">Saved Items</h1>
                                </div>
                                <span className="text-gray-500">{savedPosts.length} items</span>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                </div>
                            ) : savedPosts.length === 0 ? (
                                <div className="text-center py-12">
                                    <FaBookmark className="mx-auto text-gray-400 text-4xl mb-4" />
                                    <h2 className="text-xl font-medium text-gray-900 mb-2">No saved items yet</h2>
                                    <p className="text-gray-500">Items you save will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {savedPosts.map(post => (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                                        >
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <img
                                                            src={post.userImageUrl || "https://via.placeholder.com/40"}
                                                            alt=""
                                                            className="w-10 h-10 rounded-full"
                                                        />
                                                        <div>
                                                            <h3 className="font-medium">{post.userName}</h3>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(post.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleUnsave(post.id)}
                                                        className="text-gray-600 hover:text-red-500"
                                                    >
                                                        <FaBookmark className="text-xl" />
                                                    </button>
                                                </div>

                                                {post.description && (
                                                    <p className="text-gray-800 mb-4">{post.description}</p>
                                                )}

                                                {post.mediaType === 'IMAGE' && post.imageUrls?.[0] && (
                                                    <img
                                                        src={post.imageUrls[0]}
                                                        alt="Post content"
                                                        className="w-full max-h-[400px] object-contain rounded"
                                                    />
                                                )}

                                                {post.mediaType === 'VIDEO' && (
                                                    <video
                                                        src={post.videoUrl}
                                                        className="w-full max-h-[400px] object-contain rounded"
                                                        controls
                                                    />
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedItemsPage;