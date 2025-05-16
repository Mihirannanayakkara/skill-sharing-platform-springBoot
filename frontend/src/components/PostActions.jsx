import React, { useState, useEffect, useRef } from 'react';
import { HeartIcon, ChatBubbleBottomCenterTextIcon, ShareIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const PostActions = ({ post, onDelete, onEdit, onActionComplete, menuOnly = false, onCommentClick }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [isLikeProcessing, setIsLikeProcessing] = useState(false);
    const menuRef = useRef(null);
    const userId = JSON.parse(localStorage.getItem('user'))?.id;

    useEffect(() => {
        // Only fetch initial data once when component mounts
        const initData = async () => {
            if (!menuOnly) {
                try {
                    const [likesRes, commentsRes, commentsCountRes] = await Promise.all([
                        fetch(`http://localhost:8070/api/interactions/status?postId=${post.id}&userId=${userId}`),
                        fetch(`http://localhost:8070/api/interactions/count/${post.id}`),
                        fetch(`http://localhost:8070/api/comments/count/${post.id}`)
                    ]);
                    const likeData = await likesRes.json();
                    const likesData = await commentsRes.json();
                    const commentsData = await commentsCountRes.json();
                    setIsLiked(likeData.hasLiked);
                    setLikesCount(likesData.count);
                    setCommentsCount(commentsData.count || 0);
                } catch (error) {
                    console.error('Error fetching initial data:', error);
                }
            }
        };
        initData();

        // Handle click outside
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [post.id, userId, menuOnly]);

    const handleLike = async () => {
        if (isLikeProcessing) return;

        try {
            setIsLikeProcessing(true);

            // Optimistic update
            const newIsLiked = !isLiked;
            setIsLiked(newIsLiked);
            setLikesCount(prevCount => newIsLiked ? prevCount + 1 : prevCount - 1);

            const res = await fetch(`http://localhost:8070/api/interactions/toggle?postId=${post.id}&userId=${userId}`, {
                method: 'POST'
            });

            if (!res.ok) {
                // Revert on failure
                setIsLiked(!newIsLiked);
                setLikesCount(prevCount => newIsLiked ? prevCount - 1 : prevCount + 1);
            }
        } catch (error) {
            // Revert on error
            setIsLiked(!isLiked);
            setLikesCount(prevCount => isLiked ? prevCount + 1 : prevCount - 1);
        } finally {
            setIsLikeProcessing(false);
        }
    };

    const handleDeleteClick = () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            if (onDelete) {
                onDelete();
            } else if (onActionComplete) {
                handleDelete();
            }
        }
        setShowMenu(false);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8070/api/media/delete/${post.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Delete failed:', errorText);
                alert('Failed to delete post. Please try again later.');
                return;
            }

            if (onActionComplete) {
                onActionComplete();
            }
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete post. Please try again later.');
        }
    };

    const handleEditClick = () => {
        if (onEdit) {
            onEdit();
        }
        setShowMenu(false);
    };

    if (menuOnly) {
        return (
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <EllipsisHorizontalIcon className="w-6 h-6 text-gray-600" />
                </button>

                {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 ring-1 ring-black ring-opacity-5">
                        <button
                            onClick={() => {
                                handleEditClick();
                                setShowMenu(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                        >
                            Edit Post
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 focus:outline-none focus:bg-red-50"
                        >
                            Delete Post
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-6">
            <button
                onClick={handleLike}
                disabled={isLikeProcessing}
                className={`flex items-center space-x-2 text-gray-600 hover:text-blue-600 ${
                    isLikeProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {isLiked ? (
                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                ) : (
                    <HeartIcon className="w-6 h-6" />
                )}
                <span>{likesCount}</span>
            </button>
            <button
                onClick={onCommentClick}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
            >
                <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />
                <span>{commentsCount}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <ShareIcon className="w-6 h-6" />
            </button>
        </div>
    );
};

export default PostActions;