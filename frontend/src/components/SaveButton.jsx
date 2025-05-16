import React, { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { eventEmitter } from '../utils/eventEmitter';

const SaveButton = ({ postId }) => {
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const checkSavedStatus = async () => {
            if (!currentUser?.id || !postId) return;

            try {
                const response = await fetch(`http://localhost:8070/api/saved/status?userId=${currentUser.id}&postId=${postId}`);
                if (response.ok) {
                    const data = await response.json();
                    setIsSaved(data.saved);
                }
            } catch (error) {
                console.error('Error checking saved status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkSavedStatus();
    }, [postId, currentUser?.id]);

    const handleSave = async () => {
        if (!currentUser?.id || !postId) return;

        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:8070/api/saved/toggle?userId=${currentUser.id}&postId=${postId}`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Failed to toggle save status');
            }

            const result = await response.json();
            setIsSaved(result.saved);

            // Get updated count
            const countResponse = await fetch(`http://localhost:8070/api/saved/count?userId=${currentUser.id}`);
            if (countResponse.ok) {
                const countData = await countResponse.json();
                eventEmitter.emit('savedPostsUpdated', {
                    count: countData.count,
                    action: result.saved ? 'save' : 'unsave'
                });
            }
        } catch (error) {
            console.error('Error saving post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentUser?.id) return null;

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            disabled={isLoading}
            className={`flex items-center space-x-1 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
            } ${isSaved ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-700`}
        >
            {isSaved ? <FaBookmark size={16} /> : <FaRegBookmark size={16} />}
            <span className="text-sm">{isSaved ? 'Saved' : 'Save'}</span>
        </motion.button>
    );
};

export default SaveButton;