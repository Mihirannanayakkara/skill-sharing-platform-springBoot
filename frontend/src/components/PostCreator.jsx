import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaImage, FaCertificate, FaCalendarAlt, FaTimes, FaCamera, FaVideo, FaPlay } from 'react-icons/fa';

// Media Post Component
const MediaPostForm = ({ mediaPost, setMediaPost, onSubmit }) => {
    // File input ref
    const fileInputRef = useRef(null);

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const newPreviewUrls = selectedFiles.map(file => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith('video/') ? 'video' : 'image'
        }));

        setMediaPost({
            ...mediaPost,
            files: [...mediaPost.files, ...selectedFiles],
            previewUrls: [...mediaPost.previewUrls, ...newPreviewUrls]
        });
    };

    // Remove a selected file
    const removeFile = (index) => {
        const newFiles = [...mediaPost.files];
        const newPreviewUrls = [...mediaPost.previewUrls];

        URL.revokeObjectURL(newPreviewUrls[index].url);
        newFiles.splice(index, 1);
        newPreviewUrls.splice(index, 1);

        setMediaPost({
            ...mediaPost,
            files: newFiles,
            previewUrls: newPreviewUrls
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
      <textarea
          placeholder="What's on your mind?"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          rows="4"
          value={mediaPost.description}
          onChange={(e) => setMediaPost({...mediaPost, description: e.target.value})}
      />

            {/* Media Preview Section */}
            {mediaPost.previewUrls.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-medium mb-2 text-gray-700">Media Preview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {mediaPost.previewUrls.map((preview, index) => (
                            <div key={index} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                {preview.type === 'image' ? (
                                    <img
                                        src={preview.url}
                                        alt={`Preview ${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="relative w-full h-full flex items-center justify-center bg-gray-800">
                                        <video
                                            src={preview.url}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-black bg-opacity-50 rounded-full p-2 text-white">
                                                <FaPlay />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                                <button
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md"
                                    onClick={() => removeFile(index)}
                                >
                                    <FaTimes size={12} />
                                </button>
                                <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 rounded px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition">
                                    {preview.type === 'video' ? 'Video' : 'Image'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* File Upload */}
            <div className="mb-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                        <FaCamera className="text-blue-500" />
                        <span className="font-medium text-blue-500">Photos</span>
                    </button>
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                        <FaVideo className="text-blue-500" />
                        <span className="font-medium text-blue-500">Videos</span>
                    </button>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* Post Button */}
            <div className="flex justify-end">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
                    onClick={onSubmit}
                    disabled={!mediaPost.description && mediaPost.files.length === 0}
                >
                    Post
                </motion.button>
            </div>
        </motion.div>
    );
};

// Post Type Selector Component
const PostTypeSelector = ({ onSelect }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-lg"
        >
            <h2 className="text-xl font-bold text-center mb-6">What would you like to share?</h2>
            <div className="grid grid-cols-3 gap-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect('media')}
                    className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 p-6 rounded-lg transition"
                >
                    <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-3">
                        <FaImage size={20} />
                    </div>
                    <span className="font-medium text-blue-700">Media Post</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect('certificate')}
                    className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 p-6 rounded-lg transition"
                >
                    <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-3">
                        <FaCertificate size={20} />
                    </div>
                    <span className="font-medium text-green-700">Certificate</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect('event')}
                    className="flex flex-col items-center justify-center bg-red-50 hover:bg-red-100 p-6 rounded-lg transition"
                >
                    <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-3">
                        <FaCalendarAlt size={20} />
                    </div>
                    <span className="font-medium text-red-700">Event</span>
                </motion.button>
            </div>
        </motion.div>
    );
};

// Main PostCreator component
const PostCreator = () => {
    const [showMainModal, setShowMainModal] = useState(false);
    const [showTypeSelector, setShowTypeSelector] = useState(false);
    const [activeTab, setActiveTab] = useState('media');
    const [isSticky, setIsSticky] = useState(false);
    const stickyRef = useRef(null);
    const modalContentRef = useRef(null);

    // State for media post
    const [mediaPost, setMediaPost] = useState({
        description: '',
        files: [],
        previewUrls: []
    });

    // State for event post
    const [eventPost, setEventPost] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        virtual: false
    });

    // Handle scroll for sticky buttons
    useEffect(() => {
        const handleScroll = () => {
            if (stickyRef.current) {
                const sticky = stickyRef.current.getBoundingClientRect().top <= 0;
                setIsSticky(sticky);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Open the modal with specific tab
    const openModalWithTab = (tab) => {
        setActiveTab(tab);
        setShowMainModal(true);
        setShowTypeSelector(false);
    };

    // Open post type selector
    const openPostTypeSelector = () => {
        setShowTypeSelector(true);
    };

    // Post submission handler (placeholder)
    const submitPost = () => {
        if (activeTab === 'media') {
            console.log("Submitting media post:", mediaPost);
            // Reset form after submission
            setMediaPost({ description: '', files: [], previewUrls: [] });
        } else if (activeTab === 'event') {
            console.log("Submitting event post:", eventPost);
            setEventPost({
                title: '',
                description: '',
                date: '',
                time: '',
                location: '',
                virtual: false
            });
        }

        setShowMainModal(false);
    };

    return (
        <div className="w-full">
            {/* Create Post Button */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openPostTypeSelector}
                    className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center transition duration-200"
                >
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        <FaPlus size={14} />
                    </div>
                    <span className="text-gray-500">Create Post</span>
                </motion.button>

                {/* Sticky action buttons reference point */}
                <div ref={stickyRef}></div>

                {/* Action buttons */}
                <div className={`flex justify-around mt-4 py-3 bg-white ${isSticky ? 'fixed top-0 left-0 right-0 z-10 shadow-md px-4' : ''}`}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModalWithTab('media')}
                        className="flex items-center text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md transition duration-200"
                    >
                        <FaImage className="mr-2" /> Media
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModalWithTab('certificate')}
                        className="flex items-center text-green-600 hover:bg-green-50 px-4 py-2 rounded-md transition duration-200"
                    >
                        <FaCertificate className="mr-2" /> Certificate
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModalWithTab('event')}
                        className="flex items-center text-red-600 hover:bg-red-50 px-4 py-2 rounded-md transition duration-200"
                    >
                        <FaCalendarAlt className="mr-2" /> Event
                    </motion.button>
                </div>
            </div>

            {/* Post Type Selector Modal */}
            <AnimatePresence>
                {showTypeSelector && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowTypeSelector(false)}
                    >
                        <div onClick={e => e.stopPropagation()}>
                            <PostTypeSelector onSelect={openModalWithTab} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Modal */}
            <AnimatePresence>
                {showMainModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-90vh overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {activeTab === 'media' && 'Create Media Post'}
                                    {activeTab === 'certificate' && 'Add Certification'}
                                    {activeTab === 'event' && 'Create Event'}
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-gray-500 hover:text-gray-700 text-xl"
                                    onClick={() => setShowMainModal(false)}
                                >
                                    <FaTimes />
                                </motion.button>
                            </div>

                            {/* Modal Tabs */}
                            <div className="flex border-b border-gray-200">
                                <motion.button
                                    whileHover={{ backgroundColor: '#EBF5FF' }}
                                    className={`px-4 py-3 font-medium transition-colors ${activeTab === 'media' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                                    onClick={() => setActiveTab('media')}
                                >
                                    Media
                                </motion.button>
                                <motion.button
                                    whileHover={{ backgroundColor: '#ECFDF5' }}
                                    className={`px-4 py-3 font-medium transition-colors ${activeTab === 'certificate' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
                                    onClick={() => setActiveTab('certificate')}
                                >
                                    Certificate
                                </motion.button>
                                <motion.button
                                    whileHover={{ backgroundColor: '#FEF2F2' }}
                                    className={`px-4 py-3 font-medium transition-colors ${activeTab === 'event' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'}`}
                                    onClick={() => setActiveTab('event')}
                                >
                                    Event
                                </motion.button>
                            </div>

                            {/* Modal Content - Scrollable Area */}
                            <div
                                className="p-6 overflow-y-auto flex-1"
                                ref={modalContentRef}
                                style={{ maxHeight: 'calc(80vh - 110px)' }}
                            >
                                <AnimatePresence mode="wait">
                                    {activeTab === 'media' && (
                                        <MediaPostForm
                                            key="media"
                                            mediaPost={mediaPost}
                                            setMediaPost={setMediaPost}
                                            onSubmit={submitPost}
                                        />
                                    )}

                                    {activeTab === 'certificate' && (
                                        <Certifications
                                            key="cert"
                                            certifications={[
                                                {
                                                    name: "React Developer Certification",
                                                    issuer: "Meta",
                                                    issueDate: "2023-04-15",
                                                    credentialId: "CERT-12345",
                                                    skills: ["React", "JavaScript", "Web Development"],
                                                    image: "/api/placeholder/64/64"
                                                }
                                            ]}
                                        />
                                    )}

                                    {activeTab === 'event' && (
                                        <EventPostForm
                                            key="event"
                                            eventPost={eventPost}
                                            setEventPost={setEventPost}
                                            onSubmit={submitPost}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};



export default PostCreator;