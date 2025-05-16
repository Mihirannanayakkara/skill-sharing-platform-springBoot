import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EllipsisHorizontalIcon, HeartIcon, PencilIcon, TrashIcon, ChevronDownIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, ChatBubbleLeftIcon as ChatBubbleLeftSolidIcon } from "@heroicons/react/24/solid";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Comments = ({ postId, isExpanded: propIsExpanded = false }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [activeMenu, setActiveMenu] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(propIsExpanded);
    const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
    const [commentLikes, setCommentLikes] = useState({});
    const [commentReplies, setCommentReplies] = useState({});
    const [replyingTo, setReplyingTo] = useState(null);
    const [newReply, setNewReply] = useState('');
    const [showReplies, setShowReplies] = useState({});
    const menuRefs = useRef({});
    const commentListRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const userId = currentUser?.id;

    const fetchComments = useCallback(async () => {
        if (isLoading || !isExpanded) return;

        try {
            setIsLoading(true);
            const res = await fetch(`http://localhost:8070/api/comments/post/${postId}`);
            const data = await res.json();
            setComments(data);
            setHasInitiallyLoaded(true);

            // Fetch likes and replies for each comment
            data.forEach(comment => {
                fetchCommentLikes(comment.id);
                fetchCommentReplies(comment.id);
            });
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setIsLoading(false);
        }
    }, [postId, isLoading, isExpanded]);

    const fetchCommentLikes = async (commentId) => {
        try {
            const [likesRes, statusRes] = await Promise.all([
                fetch(`http://localhost:8070/api/comment-likes/count/${commentId}`),
                fetch(`http://localhost:8070/api/comment-likes/status?commentId=${commentId}&userId=${userId}`)
            ]);
            const likesData = await likesRes.json();
            const statusData = await statusRes.json();
            setCommentLikes(prev => ({
                ...prev,
                [commentId]: {
                    count: likesData.count,
                    hasLiked: statusData.hasLiked
                }
            }));
        } catch (error) {
            console.error('Error fetching comment likes:', error);
        }
    };

    const fetchCommentReplies = async (commentId) => {
        try {
            const res = await fetch(`http://localhost:8070/api/comment-replies/comment/${commentId}`);
            const data = await res.json();
            setCommentReplies(prev => ({
                ...prev,
                [commentId]: data
            }));
        } catch (error) {
            console.error('Error fetching comment replies:', error);
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            const res = await fetch(`http://localhost:8070/api/comment-likes/toggle?commentId=${commentId}&userId=${userId}`, {
                method: 'POST'
            });
            if (res.ok) {
                fetchCommentLikes(commentId);
            }
        } catch (error) {
            console.error('Error toggling comment like:', error);
        }
    };

    const handleSubmitReply = async (commentId) => {
        if (!newReply.trim()) return;

        try {
            const [replyRes, notificationRes] = await Promise.all([
                fetch(`http://localhost:8070/api/comment-replies?commentId=${commentId}&userId=${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                    body: newReply
                }),
                fetch(`http://localhost:8070/api/notifications`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        recipientId: comments.find(c => c.id === commentId)?.userId,
                        senderId: userId,
                        type: 'COMMENT_REPLY',
                        content: `${currentUser.name} replied to your comment: ${newReply.substring(0, 50)}${newReply.length > 50 ? '...' : ''}`,
                        postId: postId,
                        commentId: commentId
                    })
                })
            ]);

            if (replyRes.ok) {
                setNewReply('');
                setReplyingTo(null);
                fetchCommentReplies(commentId);
            }
        } catch (error) {
            console.error('Error creating reply:', error);
        }
    };

    const handleEditReply = async (replyId) => {
        try {
            const res = await fetch(`http://localhost:8070/api/comment-replies/${replyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: editContent
            });
            if (res.ok) {
                const updatedReply = await res.json();
                setCommentReplies(prev => ({
                    ...prev,
                    [updatedReply.commentId]: prev[updatedReply.commentId].map(r =>
                        r.id === replyId ? updatedReply : r
                    )
                }));
                setEditingComment(null);
                setEditContent('');
            }
        } catch (error) {
            console.error('Error updating reply:', error);
        }
    };

    const handleDeleteReply = async (replyId) => {
        if (!window.confirm('Are you sure you want to delete this reply?')) return;

        try {
            const res = await fetch(`http://localhost:8070/api/comment-replies/${replyId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setCommentReplies(prev => {
                    const newReplies = { ...prev };
                    Object.keys(newReplies).forEach(commentId => {
                        newReplies[commentId] = newReplies[commentId].filter(r => r.id !== replyId);
                    });
                    return newReplies;
                });
            }
        } catch (error) {
            console.error('Error deleting reply:', error);
        }
    };

    useEffect(() => {
        setIsExpanded(propIsExpanded);

        if (isExpanded && !hasInitiallyLoaded) {
            fetchComments();
        }

        const handleClickOutside = (event) => {
            if (activeMenu && menuRefs.current[activeMenu] && !menuRefs.current[activeMenu].contains(event.target)) {
                setActiveMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [postId, activeMenu, fetchComments, isExpanded, hasInitiallyLoaded, propIsExpanded]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await fetch(`http://localhost:8070/api/comments?postId=${postId}&userId=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: newComment
            });
            const data = await res.json();
            setComments(prevComments => [...prevComments, data]);
            setNewComment('');

            if (commentListRef.current) {
                commentListRef.current.scrollTo({
                    top: commentListRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const handleEdit = async (commentId) => {
        try {
            const res = await fetch(`http://localhost:8070/api/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: editContent
            });
            const updatedComment = await res.json();
            setComments(prevComments =>
                prevComments.map(c => c.id === commentId ? updatedComment : c)
            );
            setEditingComment(null);
            setEditContent('');
            setActiveMenu(null);
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await fetch(`http://localhost:8070/api/comments/${commentId}`, {
                method: 'DELETE'
            });
            setComments(prevComments => prevComments.filter(c => c.id !== commentId));
            setActiveMenu(null);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const commentListVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: {
            opacity: 1,
            height: 'auto',
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        exit: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.15,
                ease: "easeInOut"
            }
        }
    };

    const commentVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.2 }
        }
    };

    return (
        <div className="px-4 py-2 space-y-4">
            {!propIsExpanded && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                    {isLoading ? 'Loading...' : isExpanded ? 'Hide Comments' : 'Show Comments'}
                </button>
            )}

            <AnimatePresence mode="wait">
                {isExpanded && (
                    <motion.div
                        key="comments-section"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={commentListVariants}
                        className="space-y-4"
                    >
                        {/* Comment Form */}
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Post
                            </button>
                        </form>

                        {/* Comments List */}
                        <div
                            ref={commentListRef}
                            className="space-y-2 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                            style={{
                                maxHeight: '210px', // Height for 3 comments (3 * 70px)
                                minHeight: comments.length > 0 ? Math.min(210, comments.length * 70) : '70px'
                            }}
                        >
                            {isLoading ? (
                                <div className="flex justify-center py-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                                </div>
                            ) : comments.length === 0 ? (
                                <p className="text-center text-gray-500 py-1 text-xs">No comments yet. Be the first to comment!</p>
                            ) : (
                                comments.map((comment, index) => (
                                    <motion.div
                                        key={comment.id}
                                        variants={commentVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="space-y-1 mb-3"
                                    >
                                        <div className="flex items-start gap-2">
                                            <Link to={`/user/${comment.userId}`} className="flex-shrink-0">
                                                <img
                                                    src={comment.userImage || currentUser?.imageUrl || 'https://via.placeholder.com/40'}
                                                    alt=""
                                                    className="w-6 h-6 rounded-full object-cover border border-gray-200"
                                                />
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <div className="bg-gray-100 rounded-2xl px-3 py-2 relative group">
                                                    {comment.userId === userId && (
                                                        <div className="absolute right-2 top-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingComment(comment.id);
                                                                    setEditContent(comment.content);
                                                                }}
                                                                className="p-0.5 text-gray-500 hover:text-blue-500 rounded-full hover:bg-white/50"
                                                            >
                                                                <PencilIcon className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(comment.id)}
                                                                className="p-0.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-white/50"
                                                            >
                                                                <TrashIcon className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    )}
                                                    <Link to={`/user/${comment.userId}`} className="font-medium text-xs hover:underline">
                                                        {comment.userName}
                                                    </Link>
                                                    {editingComment === comment.id ? (
                                                        <div className="mt-1 flex gap-1">
                                                            <input
                                                                type="text"
                                                                value={editContent}
                                                                onChange={(e) => setEditContent(e.target.value)}
                                                                className="flex-1 px-2 py-0.5 text-xs border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                            />
                                                            <button
                                                                onClick={() => handleEdit(comment.id)}
                                                                className="px-2 py-0.5 text-[10px] bg-blue-500 text-white rounded-full hover:bg-blue-600"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingComment(null);
                                                                    setEditContent('');
                                                                }}
                                                                className="px-2 py-0.5 text-[10px] bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-800 text-xs break-words leading-snug">{comment.content}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 mt-0.5 px-1">
                                                    <button
                                                        onClick={() => handleLikeComment(comment.id)}
                                                        className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-blue-500"
                                                    >
                                                        {commentLikes[comment.id]?.hasLiked ? (
                                                            <HeartSolidIcon className="w-3 h-3 text-red-500" />
                                                        ) : (
                                                            <HeartIcon className="w-3 h-3" />
                                                        )}
                                                        <span>{commentLikes[comment.id]?.count || 0}</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                                        className="text-[10px] text-gray-500 hover:text-blue-500"
                                                    >
                                                        Reply
                                                    </button>
                                                    <span className="text-[10px] text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                                                    {commentReplies[comment.id]?.length > 0 && (
                                                        <button
                                                            onClick={() => setShowReplies(prev => ({
                                                                ...prev,
                                                                [comment.id]: !prev[comment.id]
                                                            }))}
                                                            className="flex items-center gap-1 text-[10px] text-blue-500 hover:text-blue-600"
                                                        >
                                                            {showReplies[comment.id] ? (
                                                                <ChatBubbleLeftSolidIcon className="w-3 h-3" />
                                                            ) : (
                                                                <ChatBubbleLeftIcon className="w-3 h-3" />
                                                            )}
                                                            <span>{commentReplies[comment.id].length}</span>
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Replies Section */}
                                                <AnimatePresence>
                                                    {showReplies[comment.id] && commentReplies[comment.id]?.length > 0 && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="pl-6 mt-1 space-y-1 relative"
                                                        >
                                                            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                                            {commentReplies[comment.id].map((reply) => (
                                                                <div key={reply.id} className="flex items-start gap-2 relative">
                                                                    <div className="absolute -left-3 top-3 w-2.5 h-0.5 bg-gray-200"></div>
                                                                    <Link to={`/user/${reply.userId}`} className="flex-shrink-0">
                                                                        <img
                                                                            src={reply.userImage || 'https://via.placeholder.com/40'}
                                                                            alt=""
                                                                            className="w-5 h-5 rounded-full object-cover border border-gray-200"
                                                                        />
                                                                    </Link>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="bg-gray-50 rounded-xl px-2.5 py-1 relative group">
                                                                            {reply.userId === userId && (
                                                                                <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setEditingComment(reply.id);
                                                                                            setEditContent(reply.content);
                                                                                        }}
                                                                                        className="p-0.5 text-gray-500 hover:text-blue-500 rounded-full hover:bg-white/50"
                                                                                    >
                                                                                        <PencilIcon className="w-2.5 h-2.5" />
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => handleDeleteReply(reply.id)}
                                                                                        className="p-0.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-white/50"
                                                                                    >
                                                                                        <TrashIcon className="w-2.5 h-2.5" />
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                            <Link to={`/user/${reply.userId}`} className="font-medium text-[11px] hover:underline">
                                                                                {reply.userName}
                                                                            </Link>
                                                                            {editingComment === reply.id ? (
                                                                                <div className="mt-1 flex gap-1">
                                                                                    <input
                                                                                        type="text"
                                                                                        value={editContent}
                                                                                        onChange={(e) => setEditContent(e.target.value)}
                                                                                        className="flex-1 px-2 py-0.5 text-[10px] border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                                    />
                                                                                    <button
                                                                                        onClick={() => handleEditReply(reply.id)}
                                                                                        className="px-2 py-0.5 text-[9px] bg-blue-500 text-white rounded-full hover:bg-blue-600"
                                                                                    >
                                                                                        Save
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setEditingComment(null);
                                                                                            setEditContent('');
                                                                                        }}
                                                                                        className="px-2 py-0.5 text-[9px] bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                                                                                    >
                                                                                        Cancel
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                <p className="text-gray-800 text-[11px] break-words leading-snug">{reply.content}</p>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-2 mt-0.5 px-1">
                                      <span className="text-[10px] text-gray-400">
                                        {new Date(reply.createdAt).toLocaleDateString()}
                                      </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Reply Form - Only show when replying */}
                                                <AnimatePresence>
                                                    {replyingTo === comment.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="pl-6 mt-1 relative"
                                                        >
                                                            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                                            <div className="absolute -left-3 top-3 w-2.5 h-0.5 bg-gray-200"></div>
                                                            <form
                                                                onSubmit={(e) => {
                                                                    e.preventDefault();
                                                                    handleSubmitReply(comment.id);
                                                                }}
                                                                className="flex gap-1"
                                                            >
                                                                <input
                                                                    type="text"
                                                                    value={newReply}
                                                                    onChange={(e) => setNewReply(e.target.value)}
                                                                    placeholder="Write a reply..."
                                                                    className="flex-1 px-2 py-1 text-[11px] border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
                                                                />
                                                                <button
                                                                    type="submit"
                                                                    disabled={!newReply.trim()}
                                                                    className="px-2 py-0.5 text-[10px] bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    Reply
                                                                </button>
                                                            </form>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Comments;