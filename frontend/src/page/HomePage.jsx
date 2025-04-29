import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaComment, FaShare, FaImage, FaCertificate, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState({ userId: '', description: '', mediaFiles: [], isVideo: false });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8070/api/media/getAll');
            const data = await res.json();
            const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

    const handleFileChange = (e) => {
        setNewPost({ ...newPost, mediaFiles: Array.from(e.target.files) });
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

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-1/4 bg-gray-100 p-4">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="font-bold">Profile</h2>
                        <p>Student at SLIIT</p>
                        <p>Kandy, Central Province</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow mt-4">
                        <h2 className="font-bold">Connections</h2>
                        <p>Profile viewers: 8</p>
                        <p>Post impressions: 6</p>
                    </div>
                </aside>
                <main className="flex-1 bg-gray-50 p-4 overflow-y-auto">
                    <div className="bg-white p-4 rounded shadow mb-4">
                        <h2 className="font-bold">Start a post</h2>
                        <textarea
                            placeholder="What's on your mind?"
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                        />
                        <div className="flex justify-around mt-4">
                            <button className="flex items-center text-blue-600">
                                <FaImage className="mr-2" /> Media
                            </button>
                            <button className="flex items-center text-green-600">
                                <FaCertificate className="mr-2" /> Certificate
                            </button>
                            <button className="flex items-center text-red-600">
                                <FaCalendarAlt className="mr-2" /> Event
                            </button>
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="loader"></div>
                        </div>
                    ) : posts.length === 0 ? (
                        <p className="text-gray-600">No posts found.</p>
                    ) : (
                        posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                custom={index}
                                initial="hidden"
                                animate="visible"
                                variants={postVariants}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="p-6 mb-8 bg-white rounded-lg shadow-lg"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                                        {post.userId?.charAt(0) || 'U'}
                                    </div>
                                    <p className="font-bold text-gray-800">{post.userId || 'User'}</p>
                                </div>

                                <p className="mb-4 text-gray-700">
                                    {post.description} {post.originalPostId && (
                                    <motion.span
                                        className="text-blue-500 ml-1"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        (Shared)
                                    </motion.span>
                                )}
                                </p>

                                {post.mediaType === 'IMAGE' &&
                                    post.imageUrls?.map((url, idx) => (
                                        <motion.img
                                            key={idx}
                                            src={url}
                                            alt={`Post ${idx}`}
                                            className="w-full rounded-lg mb-4 shadow-md"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                        />
                                    ))}

                                {post.mediaType === 'VIDEO' && post.videoUrl && (
                                    <motion.video
                                        controls
                                        className="w-full rounded-lg mb-4 shadow-md"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <source src={post.videoUrl} type="video/mp4" />
                                    </motion.video>
                                )}

                                <div className="flex justify-around mt-4 mb-4">
                                    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                        <button className="text-blue-600">
                                            <FaThumbsUp />
                                        </button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                        <button className="text-blue-600">
                                            <FaComment />
                                        </button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                        <button className="text-blue-600">
                                            <FaShare />
                                        </button>
                                    </motion.div>
                                </div>

                                <hr className="my-4" />

                                <div className="flex gap-4 items-center">
                                    <div className="bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center">U</div>
                                    <input
                                        type="text"
                                        placeholder="Write a comment..."
                                        className="flex-1 p-2 border border-gray-300 rounded"
                                    />
                                </div>
                            </motion.div>
                        ))
                    )}
                </main>
                <aside className="w-1/4 bg-gray-100 p-4">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="font-bold">Today's Puzzle Games</h2>
                        <p>Zip: Complete the path</p>
                        <p>Tango: Harmonize the grid</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow mt-4">
                        <h2 className="font-bold">Add to your feed</h2>
                        <p>W3Schools.com</p>
                        <p>Follow</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default HomePage;