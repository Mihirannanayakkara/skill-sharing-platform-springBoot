import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';

const DeletePostModal = ({ postId, onClose, onConfirmed }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8070/api/media/delete/${postId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                enqueueSnackbar('Post deleted successfully!', { variant: 'success' });
                onConfirmed();
                onClose();
            } else {
                throw new Error('Failed to delete post');
            }
        } catch (error) {
            console.error('Delete failed:', error);
            enqueueSnackbar('Failed to delete post. Please try again.', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
            >
                <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                <p className="mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default DeletePostModal;