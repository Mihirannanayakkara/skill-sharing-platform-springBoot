import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaThumbsUp, FaComment, FaShare, FaEllipsisH, FaBookmark } from 'react-icons/fa';
import Navbar from '../components/Navbar.jsx';
import ProfileSidebar from '../components/ProfileSidebar.jsx';
import UpcommingLearing from '../components/UpcomingLearning.jsx';
import PostCreator from '../components/PostCreator.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState({ userId: '', description: '', mediaFiles: [], isVideo: false });
    const [likedPosts, setLikedPosts] = useState({});
    const [commentInputs, setCommentInputs] = useState({});
    const [showComments, setShowComments] = useState({});
    const [savedPosts, setSavedPosts] = useState({});
    const [showSavedOnly, setShowSavedOnly] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const loggedInUser = {
        name: 'Rahul Nanayakkara',
        title: 'Student at SLIIT',
        location: 'Kandy, Central Province',
        profileViews: 42,
        postImpressions: 186,
        followers: 112,
        following: 98,
        profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        backgroundImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80'
    };

    useEffect(() => {
        fetchPosts();

        // Check if we should show saved posts based on URL
        if (location.pathname === '/saved-items') {
            setShowSavedOnly(true);
        } else {
            setShowSavedOnly(false);
        }

        // Load saved posts from localStorage
        const savedPostsData = localStorage.getItem('savedPosts');
        if (savedPostsData) {
            setSavedPosts(JSON.parse(savedPostsData));
        }
    }, [location.pathname]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8070/api/media/getAll');
            const data = await res.json();
            const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Initialize comments for each post
            const initialComments = {};
            sortedPosts.forEach(post => {
                initialComments[post.id] = post.comments || [];
            });

            setPosts(sortedPosts);
        } catch (err) {
            console.error('Error loading posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async () => {
        const formData = new FormData();
        formData.append('userId', newPost.userId);
        formData.append('description', newPost.description);
        newPost.mediaFiles.forEach(file => formData.append('mediaFiles', file));
        formData.append('isVideo', newPost.isVideo);

        try {
            const res = await fetch('http://localhost:8070/api/media/post', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                fetchPosts();
                setNewPost({ userId: '', description: '', mediaFiles: [], isVideo: false });
            } else {
                console.error('Failed to create post');
            }
        } catch (err) {
            console.error('Error creating post:', err);
        }
    };

    const handleLike = (postId) => {
        setLikedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
        // Here you would typically call an API to update the like status
    };

    const toggleComments = (postId) => {
        setShowComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const handleCommentChange = (postId, value) => {
        setCommentInputs(prev => ({
            ...prev,
            [postId]: value
        }));
    };

    const submitComment = (postId) => {
        const commentText = commentInputs[postId];
        if (!commentText || commentText.trim() === '') return;

        // Here you would typically call an API to save the comment
        // For now, we'll just update the local state
        const newComment = {
            id: Date.now().toString(),
            user: {
                name: loggedInUser.name,
                profileImage: loggedInUser.profileImage
            },
            text: commentText,
            timestamp: new Date().toISOString()
        };

        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        comments: [...(post.comments || []), newComment]
                    }
                    : post
            )
        );

        // Clear the input
        setCommentInputs(prev => ({
            ...prev,
            [postId]: ''
        }));
    };

    const toggleSavePost = (postId) => {
        const updatedSavedPosts = {
            ...savedPosts,
            [postId]: !savedPosts[postId]
        };

        // If the value is false, remove the key entirely
        if (!updatedSavedPosts[postId]) {
            delete updatedSavedPosts[postId];
        }

        setSavedPosts(updatedSavedPosts);

        // Save to localStorage
        localStorage.setItem('savedPosts', JSON.stringify(updatedSavedPosts));
    };

    const handleSavedItemsNavigation = () => {
        navigate('/saved-items');
        setShowSavedOnly(true);
    };

    const handleAllPostsNavigation = () => {
        navigate('/');
        setShowSavedOnly(false);
    };

    const postVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    // Filter posts if we're showing saved items only
    const displayPosts = showSavedOnly
        ? posts.filter(post => savedPosts[post.id])
        : posts;

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-1/4 bg-gray-100 p-4">
                    <ProfileSidebar
                        user={loggedInUser}
                        onSavedItemsClick={handleSavedItemsNavigation}
                    />
                </aside>
                <main className="flex-1 bg-gray-50 p-4 overflow-y-auto">
                    {showSavedOnly && (
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Saved Posts</h2>
                                <button
                                    onClick={handleAllPostsNavigation}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    View All Posts
                                </button>
                            </div>
                            <p className="text-gray-600">
                                {Object.keys(savedPosts).length === 0
                                    ? "You haven't saved any posts yet."
                                    : `You have ${Object.keys(savedPosts).length} saved posts.`}
                            </p>
                        </div>
                    )}

                    {!showSavedOnly && <PostCreator />}

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="loader"></div>
                        </div>
                    ) : displayPosts.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">
                            {showSavedOnly
                                ? "You haven't saved any posts yet."
                                : "No posts found."}
                        </p>
                    ) : (
                        displayPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                custom={index}
                                initial="hidden"
                                animate="visible"
                                variants={postVariants}
                                className="p-6 mb-8 bg-white rounded-lg shadow-lg"
                            >
                                {/* Post Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <img
                                            src={loggedInUser.profileImage}
                                            alt={post.userId || 'User'}
                                            className="w-10 h-10 rounded-full mr-3 object-cover"
                                        />
                                        <div>
                                            <p className="font-bold text-gray-800">{post.userId || 'User'}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => toggleSavePost(post.id)}
                                            className={`text-lg ${savedPosts[post.id] ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-600`}
                                            aria-label={savedPosts[post.id] ? "Unsave post" : "Save post"}
                                        >
                                            <FaBookmark />
                                        </motion.button>
                                        <button className="text-gray-500 hover:text-gray-700">
                                            <FaEllipsisH />
                                        </button>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <p className="mb-4 text-gray-700">
                                    {post.description} {post.originalPostId && (
                                    <motion.span
                                        className="text-blue-500 ml-1"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        (Shared post)
                                    </motion.span>
                                )}
                                </p>

                                {/* Media Content */}
                                {post.mediaType === 'IMAGE' && post.imageUrls && post.imageUrls.length > 0 && (
                                    <div className={`grid ${post.imageUrls.length > 1 ? 'grid-cols-2 gap-2' : ''} mb-4`}>
                                        {post.imageUrls.map((url, i) => (
                                            <img
                                                key={i}
                                                src={url}
                                                alt={`Post image ${i + 1}`}
                                                className="rounded-lg w-full h-auto object-cover"
                                            />
                                        ))}
                                    </div>
                                )}

                                {post.mediaType === 'VIDEO' && post.videoUrl && (
                                    <div className="mb-4">
                                        <video
                                            controls
                                            className="rounded-lg w-full"
                                            src={post.videoUrl}
                                        />
                                    </div>
                                )}

                                {/* Post Actions */}
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleLike(post.id)}
                                        className={`flex items-center space-x-1 ${likedPosts[post.id] ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-600`}
                                    >
                                        <FaThumbsUp />
                                        <span>Like</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => toggleComments(post.id)}
                                        className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
                                    >
                                        <FaComment />
                                        <span>Comment</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
                                    >
                                        <FaShare />
                                        <span>Share</span>
                                    </motion.button>
                                </div>

                                {/* Comments Section */}
                                <AnimatePresence>
                                    {showComments[post.id] && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="mt-4 pt-4 border-t border-gray-100"
                                        >
                                            {/* Comment Input */}
                                            <div className="flex items-start space-x-2 mb-4">
                                                <img
                                                    src={loggedInUser.profileImage}
                                                    alt={loggedInUser.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <div className="flex-1 relative">
                                                    <input
                                                        type="text"
                                                        value={commentInputs[post.id] || ''}
                                                        onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                                        placeholder="Write a comment..."
                                                        className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        onKeyPress={(e) => e.key === 'Enter' && submitComment(post.id)}
                                                    />
                                                    <button
                                                        onClick={() => submitComment(post.id)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
                                                    >
                                                        Post
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Comments List */}
                                            <div className="space-y-3">
                                                {post.comments && post.comments.map((comment) => (
                                                    <div key={comment.id} className="flex items-start space-x-2">
                                                        <img
                                                            src={comment.user.profileImage}
                                                            alt={comment.user.name}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="bg-gray-100 rounded-lg px-3 py-2">
                                                                <p className="font-semibold text-sm">{comment.user.name}</p>
                                                                <p className="text-sm">{comment.text}</p>
                                                            </div>
                                                            <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                                                                <button className="hover:text-blue-600">Like</button>
                                                                <button className="hover:text-blue-600">Reply</button>
                                                                <span>{new Date(comment.timestamp).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))
                    )}
                </main>
                <aside className="w-1/4 bg-gray-100 p-4">
                    <UpcommingLearing />
                </aside>
            </div>
        </div>
    );
};

export default HomePage;