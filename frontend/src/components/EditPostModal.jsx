import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaImage, FaVideo, FaTimes, FaPlay, FaExclamationCircle } from 'react-icons/fa';
import { useSnackbar } from 'notistack';

const EditPostModal = ({ post, onClose, onSaved }) => {
    const [newDescription, setNewDescription] = useState(post.description || '');
    const [newMediaFiles, setNewMediaFiles] = useState(null);
    const [isVideo, setIsVideo] = useState(post.mediaType === 'VIDEO');
    const [previewFiles, setPreviewFiles] = useState([]);
    const [wordCount, setWordCount] = useState(post.description ? post.description.trim().split(/\s+/).length : 0);
    const [validationError, setValidationError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setNewDescription(post.description);
        setIsVideo(post.mediaType === 'VIDEO');
        if (post.mediaType === 'IMAGE' && post.imageUrls) {
            setPreviewFiles(post.imageUrls.map(url => ({ preview: url, type: 'image' })));
        } else if (post.mediaType === 'VIDEO' && post.videoUrl) {
            setPreviewFiles([{ preview: post.videoUrl, type: 'video' }]);
        }
    }, [post]);

    const validateFiles = () => {
        if (!isVideo && previewFiles.length > 3) {
            setValidationError('You can upload a maximum of 3 images.');
        } else if (wordCount > 50) {
            setValidationError('Description should not exceed 50 words.');
        } else {
            setValidationError('');
        }
    };

    useEffect(() => {
        validateFiles();
    }, [previewFiles, isVideo, wordCount]);

    const handleDescriptionChange = (e) => {
        const newDesc = e.target.value;
        setNewDescription(newDesc);
        setWordCount(newDesc.trim().split(/\s+/).length);
    };

    const handleFileChange = (e, fileType) => {
        const selectedFiles = Array.from(e.target.files);
        const newFiles = selectedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            type: fileType
        }));
        setPreviewFiles(newFiles);
        setNewMediaFiles(e.target.files);
        setIsVideo(fileType === 'video');
    };

    const removeFile = (index) => {
        const newFiles = [...previewFiles];
        if (newFiles[index].file) {
            URL.revokeObjectURL(newFiles[index].preview);
        }
        newFiles.splice(index, 1);
        setPreviewFiles(newFiles);
        if (newFiles.length === 0) {
            setNewMediaFiles(null);
        }
    };

    const handleEdit = async () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('description', newDescription);
        formData.append('isVideo', isVideo);

        if (newMediaFiles && newMediaFiles.length > 0) {
            Array.from(newMediaFiles).forEach(file => {
                formData.append('mediaFiles', file);
            });
        }

        try {
            const response = await fetch(`http://localhost:8070/api/media/posts/${post.id}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                enqueueSnackbar('Post updated successfully!', { variant: 'success' });
                onSaved();
                onClose();
            } else {
                throw new Error('Failed to update post');
            }
        } catch (error) {
            console.error('Update failed:', error);
            enqueueSnackbar('Failed to update post. Please try again.', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const isEditDisabled = !newDescription || previewFiles.length === 0 || (!isVideo && previewFiles.length > 3) || validationError !== '' || wordCount > 50 || isLoading;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h2>
                <textarea
                    placeholder="What's on your mind? (Max 50 words)"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    rows="4"
                    value={newDescription}
                    onChange={handleDescriptionChange}
                />
                <div className="text-sm text-gray-500 mb-4">
                    {wordCount}/50 words
                </div>

                {previewFiles.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-medium mb-2 text-gray-700">Media Preview</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {previewFiles.map((file, index) => (
                                <div key={index} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                    {file.type === 'image' ? (
                                        <img src={file.preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="relative w-full h-full flex items-center justify-center bg-gray-800">
                                            <video src={file.preview} className="w-full h-full object-cover" />
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
                                        {file.type === 'video' ? 'Video' : 'Image'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-4">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => imageInputRef.current.click()}
                            className="flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            <FaImage className="text-blue-500" />
                            <span className="font-medium text-blue-500">Change Photos</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => videoInputRef.current.click()}
                            className="flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            <FaVideo className="text-blue-500" />
                            <span className="font-medium text-blue-500">Change Video</span>
                        </button>
                    </div>
                    <input
                        ref={imageInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'image')}
                    />
                    <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'video')}
                    />
                </div>

                {validationError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 flex items-center text-red-500"
                    >
                        <FaExclamationCircle className="mr-2" />
                        <span>{validationError}</span>
                    </motion.div>
                )}

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition" disabled={isLoading}>Cancel</button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 text-white rounded transition ${
                            isEditDisabled
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        onClick={handleEdit}
                        disabled={isEditDisabled}
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

export default EditPostModal;