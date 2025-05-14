import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaImage, FaVideo, FaTimes, FaPlay, FaExclamationCircle } from 'react-icons/fa';

const CreatePost = () => {
    const [files, setFiles] = useState([]);
    const [description, setDescription] = useState('');
    const [isVideo, setIsVideo] = useState(false);
    const [validationError, setValidationError] = useState('');
    const navigate = useNavigate();
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const [wordCount, setWordCount] = useState(0);

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    useEffect(() => {
        validateFiles();
    }, [files, isVideo , wordCount]);

    const validateFiles = () => {
        if (!isVideo && files.length > 3) {
            setValidationError('You can upload a maximum of 3 images.');
        } else if (wordCount > 50) {
            setValidationError('Description should not exceed 50 words.');
        } else {
            setValidationError('');
        }
    };

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const newFiles = selectedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            type: 'image'
        }));
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
        setIsVideo(false);
    };

    const handleVideoChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFiles([{
                file: selectedFile,
                preview: URL.createObjectURL(selectedFile),
                type: 'video'
            }]);
            setIsVideo(true);
        }
    };

    const handleDescriptionChange = (e) => {
        const newDescription = e.target.value;
        setDescription(newDescription);
        setWordCount(newDescription.trim().split(/\s+/).length);
    };

    const handleDragDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (!isVideo && droppedFiles.length > 3) {
            alert("You can upload maximum 3 images.");
            return;
        }
        const newFiles = droppedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            type: file.type.startsWith('video/') ? 'video' : 'image'
        }));
        setFiles([...files, ...newFiles]);
    };

    const removeFile = (index) => {
        const newFiles = [...files];
        URL.revokeObjectURL(newFiles[index].preview);
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length === 0) {
            alert("Please upload at least one file.");
            return;
        }
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('description', description);
        formData.append('isVideo', isVideo);

        files.forEach(fileObj => {
            formData.append('mediaFiles', fileObj.file);
        });

        try {
            const res = await fetch('http://localhost:8070/api/media/post', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                alert('Post created successfully!');
                navigate('/post/myposts');
            } else {
                const text = await res.text();
                alert('Error: ' + text);
            }
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        }
    };

    const isPostDisabled = !description || files.length === 0 || (!isVideo && files.length > 3) || validationError !== '' || wordCount > 50;

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Post</h1>
                    <form onSubmit={handleSubmit} onDragOver={(e) => e.preventDefault()} onDrop={handleDragDrop}>
           <textarea
               placeholder="What's on your mind? (Max 50 words)"
               className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
               rows="4"
               value={description}
               onChange={handleDescriptionChange}
           />
                        <div className="text-sm text-gray-500 mb-4">
                            {wordCount}/50 words
                        </div>
                        {files.length > 0 && (
                            <div className="mb-4">
                                <h3 className="font-medium mb-2 text-gray-700">Media Preview</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {files.map((file, index) => (
                                        <div key={index}
                                             className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            {file.type === 'image' ? (
                                                <img
                                                    src={file.preview}
                                                    alt={`Preview ${index}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="relative w-full h-full flex items-center justify-center bg-gray-800">
                                                    <video
                                                        src={file.preview}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="bg-black bg-opacity-50 rounded-full p-2 text-white">
                                                            <FaPlay/>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div
                                                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"/>
                                            <button
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md"
                                                onClick={() => removeFile(index)}
                                            >
                                                <FaTimes size={12}/>
                                            </button>
                                            <div
                                                className="absolute bottom-2 left-2 bg-black bg-opacity-60 rounded px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition">
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
                                    <FaImage className="text-blue-500"/>
                                    <span className="font-medium text-blue-500">Photos</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => videoInputRef.current.click()}
                                    className="flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <FaVideo className="text-blue-500"/>
                                    <span className="font-medium text-blue-500">Video</span>
                                </button>
                            </div>
                            <input
                                ref={imageInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            <input
                                ref={videoInputRef}
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={handleVideoChange}
                            />
                        </div>

                        {validationError && (
                            <motion.div
                                initial={{opacity: 0, y: -10}}
                                animate={{opacity: 1, y: 0}}
                                className="mb-4 flex items-center text-red-500"
                            >
                                <FaExclamationCircle className="mr-2"/>
                                <span>{validationError}</span>
                            </motion.div>
                        )}

                        <div className="flex justify-end">
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                className={`px-6 py-2 text-white rounded-md transition ${
                                    isPostDisabled
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                                type="submit"
                                disabled={isPostDisabled}
                            >
                                Post
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CreatePost;