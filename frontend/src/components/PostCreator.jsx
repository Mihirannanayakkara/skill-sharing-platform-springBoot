import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaImage, FaCertificate, FaCalendarAlt } from 'react-icons/fa';
import CreatePost from '../pages/CreatePost';
import CertificatePage from '../pages/CertificatePage';
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

    const openModalWithTab = (tab) => {
        setActiveTab(tab);
        setShowMainModal(true);
        setShowTypeSelector(false);
    };

    const openPostTypeSelector = () => {
        setShowTypeSelector(true);
    };

    const handleCloseModal = () => {
        setShowMainModal(false);
    };

    // Render the appropriate component based on the active tab
    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'media':
                return <CreatePost onClose={handleCloseModal} />;
            case 'certificate':
                return <CertificatePage onClose={handleCloseModal} />;
            case 'event':
                return <div className="bg-white rounded-xl shadow-xl overflow-hidden p-6">Event Page Coming Soon</div>;
            default:
                return <CreatePost onClose={handleCloseModal} />;
        }
    };

    return (
        <div className="w-full">
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

                <div ref={stickyRef}></div>

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

            <AnimatePresence>
                {showMainModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="w-full max-w-3xl max-h-[90vh] overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {renderActiveComponent()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PostCreator;