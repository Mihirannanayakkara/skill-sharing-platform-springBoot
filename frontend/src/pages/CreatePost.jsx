import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaVideo, FaTimes, FaPlay, FaExclamationCircle } from 'react-icons/fa';

const CreatePost = () => {
    const [files, setFiles] = useState([]);
    const [description, setDescription] = useState('');
    const [isVideo, setIsVideo] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [aiGeneratedText, setAIGeneratedText] = useState('');
    const [generating, setGenerating] = useState(false);

    const navigate = useNavigate();
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    useEffect(() => {
        validateFiles();
    }, [files, isVideo, wordCount]);

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
        setWordCount(newDescription.trim().split(/\s+/).filter(Boolean).length);
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

    const generateWithAI = async () => {
        if (files.length === 0 || !files.find(f => f.type === 'image')) {
            alert("Please upload at least one image to generate a description.");
            return;
        }

        setGenerating(true);
        setAIGeneratedText('');

        try {
            const formData = new FormData();
            // Use the first image file only for AI generation
            const firstImage = files.find(f => f.type === 'image');
            formData.append("image", firstImage.file);

            const res = await fetch("http://localhost:8070/api/aiimage/generate-description", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                alert("Failed to generate description.");
                setGenerating(false);
                return;
            }

            const data = await res.json();

            // Adjust this based on your backend response structure
            // Here checking both options in case your backend returns description or nested structure
            let aiText = "";
            if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                aiText = data.candidates[0].content.parts[0].text;
            } else if (data?.description) {
                aiText = data.description;
            } else {
                alert("No description received from AI.");
                setGenerating(false);
                return;
            }

            // Replace escaped new lines with real new lines for display
            aiText = aiText.replace(/\\n/g, '\n').trim();

            setAIGeneratedText(aiText);
        } catch (err) {
            console.error(err);
            alert("Error generating description.");
        } finally {
            setGenerating(false);
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

                        {/* Description Textarea */}
                        <div className="mb-4 relative">
                <textarea
                    placeholder="What's on your mind? (Max 50 words)"
                    className="w-full p-4 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                    rows="4"
                    value={description}
                    onChange={handleDescriptionChange}
                />
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500 font-medium">
                                    {wordCount > 40 ? (
                                        <span className={wordCount > 50 ? "text-red-500" : "text-amber-500"}>
                        {wordCount}/50 words
                      </span>
                                    ) : (
                                        <span>{wordCount}/50 words</span>
                                    )}
                                </div>
                                <motion.button
                                    type="button"
                                    onClick={generateWithAI}
                                    disabled={generating || files.length === 0 || !files.find(f => f.type === 'image')}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all ${
                                        generating || files.length === 0 || !files.find(f => f.type === 'image')
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md'
                                    }`}
                                >
                                    {generating ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                            </svg>
                                            Generate with AI
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        {/* AI Generated Description Display */}
                        <AnimatePresence>
                            {aiGeneratedText && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mb-6 overflow-hidden"
                                >
                                    <div
                                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-blue-600 rounded-full p-1.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20"
                                                         fill="currentColor">
                                                        <path
                                                            d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                                                    </svg>
                                                </div>
                                                <h4 className="font-semibold text-gray-800">AI Generated Suggestion</h4>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setAIGeneratedText('')}
                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                                     fill="currentColor">
                                                    <path fillRule="evenodd"
                                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="bg-white rounded-lg p-4 mb-3 border border-blue-100 max-h-60 overflow-y-auto">
                                            <pre className="text-gray-700 whitespace-pre-wrap font-sans">{aiGeneratedText}</pre>
                                        </div>

                                        <div className="flex justify-end">
                                            <motion.button
                                                type="button"
                                                whileHover={{scale: 1.03}}
                                                whileTap={{scale: 0.97}}
                                                onClick={() => {
                                                    setDescription(aiGeneratedText);
                                                    setWordCount(aiGeneratedText.trim().split(/\s+/).filter(Boolean).length);
                                                    setAIGeneratedText('');
                                                }}
                                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                                     fill="currentColor">
                                                    <path fillRule="evenodd"
                                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                                Use This Description
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Media Preview */}
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
                                                            <FaPlay />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div
                                                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                                            <button
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md"
                                                onClick={() => removeFile(index)}
                                                type="button"
                                            >
                                                <FaTimes size={12} />
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

                        {/* Media Upload Buttons */}
                        <div className="mb-4">
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => imageInputRef.current.click()}
                                    className="flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <FaImage className="text-blue-500" />
                                    <span className="font-medium text-blue-500">Photos</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => videoInputRef.current.click()}
                                    className="flex-1 flex items-center justify-center gap-2 cursor-pointer p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <FaVideo className="text-blue-500" />
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

                        {/* Validation Error */}
                        {validationError && (
                            <div className="flex items-center text-red-600 mb-4 gap-2">
                                <FaExclamationCircle />
                                <p>{validationError}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPostDisabled}
                            className={`w-full py-3 rounded-lg text-white font-semibold ${
                                isPostDisabled
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            Post
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CreatePost;