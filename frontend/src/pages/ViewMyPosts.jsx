import React, { useState, useEffect } from 'react';
import EditPostModal from '../components/EditPostModal.jsx';
import ConfirmDeleteModal from '../components/DeletePostModal.jsx';
import ShareModal from "../components/ShareModal";
import { motion, AnimatePresence } from 'framer-motion';
import { FaEllipsisV, FaShare, FaHeart, FaComment, FaChevronDown, FaChevronUp } from 'react-icons/fa';

import profileImage from '../assets/WhatsApp Image 2025-05-17 at 12.06.43 PM.jpeg';

const ViewMyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [postToEdit, setPostToEdit] = useState(null);
    const [postToDelete, setPostToDelete] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [sharePostId, setSharePostId] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [expandedPost, setExpandedPost] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    const fetchPosts = async () => {
        try {
            const res = await fetch(`http://localhost:8070/api/media/user/${userId}`);
            const data = await res.json();
            const sortedPosts = data.sort((a, b) => new Date(b.sharedAt || b.createdAt) - new Date(a.sharedAt || a.createdAt));
            setPosts(sortedPosts);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchPosts();
        }
    }, [userId]);

    const toggleDropdown = (postId) => {
        setDropdownOpen(dropdownOpen === postId ? null : postId);
    };

    const openImagePopup = (url) => {
        setSelectedImage(url);
    };

    const closeImagePopup = () => {
        setSelectedImage(null);
    };

    const toggleExpandPost = (postId) => {
        setExpandedPost(expandedPost === postId ? null : postId);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {posts.length === 0 ? (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center text-gray-500 text-xl"
                    >
                        No posts yet. Start sharing your moments!
                    </motion.p>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{y: 50, opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{delay: index * 0.1}}
                                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                className="h-10 w-10 rounded-full object-cover border-2 border-blue-500"
                                                src={profileImage}
                                                alt={post.originalUserName || 'User'}
                                            />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">Mihiran</h3>
                                                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <motion.button
                                                whileHover={{scale: 1.1}}
                                                whileTap={{scale: 0.9}}
                                                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                                onClick={() => toggleDropdown(post.id)}
                                            >
                                                <FaEllipsisV/>
                                            </motion.button>
                                            <AnimatePresence>
                                                {dropdownOpen === post.id && (
                                                    <motion.div
                                                        initial={{opacity: 0, scale: 0.95}}
                                                        animate={{opacity: 1, scale: 1}}
                                                        exit={{opacity: 0, scale: 0.95}}
                                                        transition={{duration: 0.2}}
                                                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 overflow-hidden"
                                                    >
                                                        <motion.button
                                                            whileHover={{backgroundColor: '#F3F4F6'}}
                                                            onClick={() => {
                                                                setPostToEdit(post);
                                                                toggleDropdown(post.id);
                                                            }}
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700"
                                                        >
                                                            Edit
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{backgroundColor: '#FEE2E2'}}
                                                            onClick={() => {
                                                                setPostToDelete(post.id);
                                                                toggleDropdown(post.id);
                                                            }}
                                                            className="block w-full text-left px-4 py-2 text-sm text-red-600"
                                                        >
                                                            Delete
                                                        </motion.button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4 text-lg">{post.description}</p>
                                    {post.mediaType === 'IMAGE' && post.imageUrls && (
                                        <div className="mb-1">
                                            <div className="grid grid-cols-2 gap-2">
                                                {post.imageUrls.slice(0, 2).map((url, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={url}
                                                        alt={`Uploaded ${idx + 1}`}
                                                        className="w-full h-64 object-cover rounded-lg cursor-pointer"
                                                        onClick={() => openImagePopup(url)}
                                                    />
                                                ))}
                                            </div>
                                            {post.imageUrls.length > 2 && (
                                                <div className="flex justify-end mt-2">
                                                    <motion.button
                                                        whileTap={{scale: 0.95}}
                                                        className="text-blue-500 hover:text-blue-700 flex items-center"
                                                        onClick={() => toggleExpandPost(post.id)}
                                                    >
                                                        {expandedPost === post.id ? (
                                                            <>
                                                                <span>Show less</span>
                                                                <FaChevronUp className="ml-1"/>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>Show more ({post.imageUrls.length - 2} more)</span>
                                                                <FaChevronDown className="ml-1"/>
                                                            </>
                                                        )}
                                                    </motion.button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <AnimatePresence>
                                        {expandedPost === post.id && post.mediaType === 'IMAGE' && (
                                            <motion.div
                                                initial={{opacity: 0, height: 0}}
                                                animate={{opacity: 1, height: 'auto'}}
                                                exit={{opacity: 0, height: 0}}
                                                transition={{duration: 0.3}}
                                                className="grid grid-cols-2 gap-2 mb-4"
                                            >
                                                {post.imageUrls.slice(2).map((url, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="cursor-pointer"
                                                        onClick={() => openImagePopup(url)}
                                                    >
                                                        <img src={url} alt={`Uploaded ${idx + 3}`}
                                                             className="w-full h-64 object-cover rounded-lg"/>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    {post.mediaType === 'VIDEO' && (
                                        <video controls src={post.videoUrl} className="w-full rounded-lg mb-2"/>
                                    )}
                                    <div className="ml-1 text-sm text-gray-500">
                                        {Math.floor(Math.random() * 2)} likes · {Math.floor(Math.random() * 2)} comments
                                        · {Math.floor(Math.random() * 2)} reposts
                                    </div>
                                    <div className="flex justify-between items-center mt-2 border-t pt-3">
                                        <div className="flex justify-between w-full">
                                            <motion.button
                                                whileHover={{scale: 1.1}}
                                                whileTap={{scale: 0.9}}
                                                className="flex-1 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors duration-200"
                                            >
                                                <FaHeart className="mr-1"/>
                                                <span>Like</span>
                                            </motion.button>
                                            <motion.button
                                                whileHover={{scale: 1.1}}
                                                whileTap={{scale: 0.9}}
                                                className="flex-1 flex items-center justify-center text-gray-500 hover:text-blue-500 transition-colors duration-200"
                                            >
                                                <FaComment className="mr-1"/>
                                                <span>Comment</span>
                                            </motion.button>
                                            <motion.button
                                                whileHover={{scale: 1.1}}
                                                whileTap={{scale: 0.9}}
                                                onClick={() => setSharePostId(post.originalPostId || post.id)}
                                                className="flex-1 flex items-center justify-center text-gray-500 hover:text-green-500 transition-colors duration-200"
                                            >
                                                <FaShare className="mr-1"/>
                                                <span>Share</span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <AnimatePresence>
                    {postToEdit && (
                        <EditPostModal
                            post={postToEdit}
                            onClose={() => setPostToEdit(null)}
                            onSaved={fetchPosts}
                        />
                    )}

                    {postToDelete && (
                        <ConfirmDeleteModal
                            postId={postToDelete}
                            onClose={() => setPostToDelete(null)}
                            onConfirmed={fetchPosts}
                        />
                    )}

                    {sharePostId && (
                        <ShareModal
                            postId={sharePostId}
                            fromUserId={userId}
                            onClose={() => setSharePostId(null)}
                            onShared={fetchPosts}
                        />
                    )}

                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeImagePopup}
                            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                        >
                            <motion.img
                                src={selectedImage}
                                alt="Full size"
                                className="max-w-full max-h-full object-contain"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ViewMyPosts;