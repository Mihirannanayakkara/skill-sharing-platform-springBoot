// src/pages/PostListPage.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PostActions from '../components/PostActions';
import Comments from '../components/Comments';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ProfileSidebar from '../components/ProfileSidebar';
import Navbar from '../components/NavBar';
import UpcomingLearning from '../components/UpcomingLearning';
import PostCreator from '../components/PostCreator';
import SaveButton from '../components/SaveButton';

// Media rendering function
const renderMedia = (post) => {
    if (post.mediaType === 'IMAGE' && post.imageUrls?.[0]) {
        return (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
                <img
                    src={post.imageUrls[0]}
                    alt="Post content"
                    className="absolute inset-0 w-full h-full object-contain bg-gray-100"
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400?text=Image+Failed+to+Load';
                    }}
                />
            </div>
        );
    } else if (post.mediaType === 'VIDEO') {
        return (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
                <video
                    src={post.videoUrl}
                    className="absolute inset-0 w-full h-full object-contain bg-gray-100"
                    controls
                    preload="metadata"
                    poster="https://via.placeholder.com/400?text=Video+Loading"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.parentElement.innerHTML = 'Video failed to load';
                    }}
                />
            </div>
        );
    }
    return null;
};

// Add Post component
const Post = React.memo(({ post, onActionComplete }) => {
    const [userData, setUserData] = useState(null);
    const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch(`http://localhost:8070/api/user/${post.userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setUserData(data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (post.userId) {
            fetchUserData();
        }
    }, [post.userId]);

    const handleCommentClick = () => {
        setIsCommentsExpanded(!isCommentsExpanded);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Post Header */}
            <div className="p-4 border-b">
                <div className="flex items-center">
                    <Link to={`/user/${post.userId}`} className="flex items-center space-x-3">
                        <img
                            src={userData?.imageUrl || 'https://via.placeholder.com/40'}
                            alt={userData?.name || 'User'}
                            className="w-10 h-10 rounded-full object-cover"
                            loading="lazy"
                        />
                        <div>
                            <p className="font-semibold hover:underline text-blue-600">
                                {userData?.name || 'Loading...'}
                            </p>
                            <p className="text-sm text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Post Content */}
            {post.description && (
                <div className="px-4 py-3">
                    <p className="text-gray-800">{post.description}</p>
                </div>
            )}

            {/* Media Content */}
            {renderMedia(post)}

            <div className="px-4 py-2 flex justify-between items-center border-t border-gray-100">
                <PostActions
                    post={post}
                    onActionComplete={onActionComplete}
                    menuOnly={false}
                    onCommentClick={handleCommentClick}
                />
                <SaveButton postId={post.id} />
            </div>
            <Comments postId={post.id} isExpanded={isCommentsExpanded} />
        </div>
    );
});

const PostListPage = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showOnlyFollowed, setShowOnlyFollowed] = useState(false);
    const [followedUsers, setFollowedUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const postsPerPage = 3;
    const [searchQuery, setSearchQuery] = useState('');
    const [userSuggestions, setUserSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [localPosts, setLocalPosts] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const fetchUsers = async (query) => {
        if (!query.trim()) {
            setUserSuggestions([]);
            return;
        }
        try {
            const response = await fetch(`http://localhost:8070/api/user/search-v2?query=${query}`);
            const data = await response.json();
            setUserSuggestions(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim()) {
                fetchUsers(searchQuery);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const fetchPosts = async (refresh = false) => {
        try {
            if (refresh) {
                setIsInitialLoading(true);
            } else {
                setIsLoadingMore(true);
            }

            const res = await fetch(`http://localhost:8070/api/media/getAll?page=${refresh ? 1 : page}&limit=${postsPerPage}`);
            const data = await res.json();

            if (data.length < postsPerPage) {
                setHasMore(false);
            }

            if (data.length > 0) {
                const newPosts = refresh ? data : [...posts, ...data];
                setPosts(newPosts);
                setLocalPosts(newPosts);
            }

            if (refresh) {
                setPage(1);
                window.scrollTo(0, 0);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setIsInitialLoading(false);
            setIsLoadingMore(false);
        }
    };

    const fetchFollowedUsers = async () => {
        try {
            const response = await fetch(`http://localhost:8070/api/user/following/${currentUser.id}`);
            if (!response.ok) throw new Error('Failed to fetch followed users');
            const data = await response.json();
            setFollowedUsers(data.map(user => user.id));
        } catch (error) {
            console.error('Error fetching followed users:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchFollowedUsers();
    }, [page]);

    const loadMore = () => {
        if (!isLoading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const filteredPosts = useMemo(() => {
        const postsToFilter = showOnlyFollowed
            ? localPosts.filter(post => followedUsers.includes(post.userId))
            : localPosts;

        if (!searchQuery.trim()) {
            return postsToFilter.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return postsToFilter.filter(post =>
            post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.userName?.toLowerCase().includes(searchQuery.toLowerCase())
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [localPosts, searchQuery, showOnlyFollowed, followedUsers]);

    const handleUserClick = (userId) => {
        window.location.href = `/user/${userId}`;
    };

    const handleActionComplete = useCallback(() => {
        fetchPosts(true);
    }, []);

    if (isInitialLoading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="pt-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex gap-6">
                            {/* Left Sidebar Skeleton */}
                            <div className="w-80 flex-shrink-0 hidden lg:block">
                                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                    <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>

                            {/* Main Feed Skeleton */}
                            <div className="flex-1 min-w-0 space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                            </div>
                                        </div>
                                        <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Right Sidebar Skeleton */}
                            <div className="w-80 flex-shrink-0 hidden lg:block">
                                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-24 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="pt-20"> {/* Added padding-top to account for fixed navbar */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex gap-6">
                        {/* Left Sidebar */}
                        <div className="w-80 flex-shrink-0 hidden lg:block">
                            <div className="sticky top-24">
                                <ProfileSidebar user={currentUser} />
                            </div>
                        </div>

                        {/* Main Feed */}
                        <div className="flex-1 min-w-0">
                            {/* Post Creator */}
                            <PostCreator onPostCreated={handleActionComplete} />

                            {filteredPosts.length === 0 ? (
                                <div className="bg-white rounded-lg shadow p-8 text-center">
                                    <div className="text-gray-500 text-lg">
                                        {showOnlyFollowed
                                            ? "No posts from users you follow. Start following more users!"
                                            : "No posts available. Be the first to post something!"}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {filteredPosts.map(post => (
                                        <Post
                                            key={post.id}
                                            post={post}
                                            onActionComplete={handleActionComplete}
                                        />
                                    ))}
                                </div>
                            )}

                            {hasMore && !isLoadingMore && (
                                <button
                                    onClick={loadMore}
                                    className="mt-6 w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Load More Posts
                                </button>
                            )}

                            {isLoadingMore && (
                                <div className="mt-6 flex justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar */}
                        <div className="w-80 flex-shrink-0 hidden lg:block">
                            <div className="sticky top-24">
                                <UpcomingLearning />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add click outside handler to close suggestions */}
            {showSuggestions && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSuggestions(false)}
                />
            )}
        </div>
    );
};

export default PostListPage;
