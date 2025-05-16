import React, { useEffect, useState } from 'react';
import ShareModal from "./ShareModal";
import PostActions from "./PostActions";
import Comments from "./Comments";

const UserPosts = ({ userId }) => {
    const [posts, setPosts] = useState([]);
    const [sharePostId, setSharePostId] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [editContent, setEditContent] = useState('');

    const fetchPosts = async () => {
        try {
            const res = await fetch(`http://localhost:8070/api/media/user/${userId}`);
            const data = await res.json();
            const sortedPosts = data.sort((a, b) => new Date(b.sharedAt || b.createdAt) - new Date(a.sharedAt || a.createdAt));
            setPosts(sortedPosts);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchPosts();
        }
    }, [userId]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await fetch(`http://localhost:8070/api/media/delete/${id}`, {
                method: 'DELETE',
            });
            fetchPosts();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleEdit = async (postId) => {
        try {
            await fetch(`http://localhost:8070/api/media/update/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: editContent
            });
            setEditingPost(null);
            setEditContent('');
            fetchPosts();
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Posts</h2>
            </div>

            {posts.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500 text-lg">No posts yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Post Header */}
                            <div className="p-4 border-b">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-sm">
                                            <p className="font-semibold text-gray-900">
                                                {post.sharedByUserName ? `Shared by ${post.sharedByUserName}` : 'Your post'}
                                            </p>
                                            <p className="text-gray-500">
                                                {new Date(post.sharedAt || post.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Post Description */}
                            {editingPost === post.id ? (
                                <div className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                            placeholder="Edit your post..."
                                        />
                                        <button
                                            onClick={() => handleEdit(post.id)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingPost(null);
                                                setEditContent('');
                                            }}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                post.description && (
                                    <div className="px-4 py-3">
                                        <p className="text-gray-800 text-base">{post.description}</p>
                                    </div>
                                )
                            )}

                            {/* Media Content */}
                            <div className="relative">
                                {post.mediaType === 'IMAGE' && post.imageUrls?.[0] && (
                                    <img
                                        src={post.imageUrls[0]}
                                        alt="Post content"
                                        className="w-full max-h-[600px] object-contain bg-black"
                                    />
                                )}
                                {post.mediaType === 'VIDEO' && (
                                    <video
                                        src={post.videoUrl}
                                        className="w-full max-h-[600px] object-contain bg-black"
                                        controls
                                    />
                                )}
                            </div>

                            {/* Post Actions */}
                            <PostActions
                                post={post}
                                onDelete={() => handleDelete(post.id)}
                                onEdit={() => {
                                    setEditingPost(post.id);
                                    setEditContent(post.description || '');
                                }}
                            />

                            {/* Comments Section */}
                            <Comments postId={post.id} />
                        </div>
                    ))}
                </div>
            )}

            {/* Share Modal */}
            {sharePostId && (
                <ShareModal
                    postId={sharePostId}
                    fromUserId={userId}
                    onClose={() => setSharePostId(null)}
                    onShared={fetchPosts}
                />
            )}
        </div>
    );
};

export default UserPosts;