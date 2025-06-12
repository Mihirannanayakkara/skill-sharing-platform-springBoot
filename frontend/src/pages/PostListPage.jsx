// src/pages/PostListPage.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PostActions from '../components/PostActions';
import Comments from '../components/Comments';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ProfileSidebar from '../components/ProfileSidebar';
import Navbar from '../components/NavBar';
import UserLearningPlans from '../components/UserLearningPlans';
import PostCreator from '../components/PostCreator';
import SaveButton from '../components/SaveButton';
import LoadingSkeleton from '../components/LoadingSkeleton';

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
                            <div className="hidden lg:block w-1/4">
                                <LoadingSkeleton type="sidebar" />
                            </div>

                            {/* Main Feed Skeleton */}
                            <div className="flex-1">
                                <LoadingSkeleton type="post" count={3} />
                            </div>

                            {/* Right Sidebar Skeleton */}
                            <div className="hidden lg:block w-1/4">
                                <LoadingSkeleton type="card" count={3} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex gap-6">
                        {/* Left Sidebar */}
                        <div className="hidden lg:block w-1/4">
                            <ProfileSidebar />
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 space-y-6">
                            {/* Search Bar */}
                            <div className="relative">
                                {/* User Suggestions */}
                                {showSuggestions && userSuggestions.length > 0 && (
                                    <div className="absolute w-full  bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                        {userSuggestions.map((user) => (
                                            <div
                                                key={user.id}
                                                className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
                                                onClick={() => handleUserClick(user.id)}
                                            >
                                                <img
                                                    src={user.imageUrl || 'https://via.placeholder.com/40'}
                                                    alt={user.name}
                                                    className="w-8 h-8 rounded-full mr-3"
                                                />
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Post Creator */}
                            <PostCreator onPostCreated={handleActionComplete} />


                            {/* Posts */}
                            {isInitialLoading ? (
                                <LoadingSkeleton type="post" count={3} />
                            ) : filteredPosts.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                    <p className="text-gray-600">No posts found</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {filteredPosts.map((post) => (
                                        <Post key={post.id} post={post} onActionComplete={handleActionComplete} />
                                    ))}
                                    {hasMore && !isLoadingMore && (
                                        <button
                                            onClick={loadMore}
                                            className="w-full py-3 bg-white text-blue-600 font-medium rounded-lg shadow-sm hover:bg-gray-50"
                                        >
                                            Load More
                                        </button>
                                    )}
                                    {isLoadingMore && (
                                        <LoadingSkeleton type="post" count={1} />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar */}
                        <div className="hidden lg:block w-1/4">
                            <UserLearningPlans />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostListPage;
