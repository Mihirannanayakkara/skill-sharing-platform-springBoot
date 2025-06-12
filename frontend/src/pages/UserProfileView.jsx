import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserPosts from '../components/UserPosts';
import SkillSection from '../components/SkillSection';

const UserProfileView = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
    const [isFollowing, setIsFollowing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showFollowModal, setShowFollowModal] = useState(null); // 'followers' or 'following' or null
    const [followList, setFollowList] = useState([]);
    const [isLoadingList, setIsLoadingList] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (userId) {
            fetchUserProfile();
            fetchFollowStats();
            if (currentUser?.id) {
                checkFollowStatus();
            }
        }
    }, [userId]);

    const fetchUserProfile = async () => {
        try {
            const res = await fetch(`http://localhost:8070/api/user/${userId}`);
            if (!res.ok) {
                if (res.status === 404) {
                    throw new Error('User not found');
                }
                throw new Error('Failed to fetch user');
            }
            const userData = await res.json();
            setUser(userData);
            setError(null);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFollowStats = async () => {
        try {
            const res = await fetch(`http://localhost:8070/api/follow/stats/${userId}`);
            if (!res.ok) throw new Error('Failed to fetch follow stats');
            const stats = await res.json();
            setFollowStats(stats);
        } catch (error) {
            console.error('Error fetching follow stats:', error);
        }
    };

    const checkFollowStatus = async () => {
        try {
            const res = await fetch(`http://localhost:8070/api/follow/check/${currentUser.id}/${userId}`);
            if (!res.ok) throw new Error('Failed to check follow status');
            const status = await res.json();
            setIsFollowing(status);
        } catch (error) {
            console.error('Error checking follow status:', error);
        }
    };

    const handleFollowToggle = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        setIsProcessing(true);
        try {
            const method = isFollowing ? 'DELETE' : 'POST';
            const res = await fetch(
                `http://localhost:8070/api/follow/${currentUser.id}/${userId}`,
                { method }
            );

            if (!res.ok) throw new Error('Failed to update follow status');

            setIsFollowing(!isFollowing);
            fetchFollowStats(); // Refresh stats after follow/unfollow
        } catch (error) {
            console.error('Error updating follow status:', error);
        } finally {
            setIsProcessing(false);
        }
    };


    const fetchFollowList = async (type) => {
        setIsLoadingList(true);
        try {
            const endpoint = type === 'followers'
                ? `http://localhost:8070/api/user/followers/${userId}`
                : `http://localhost:8070/api/user/following/${userId}`;

            const res = await fetch(endpoint);
            if (!res.ok) throw new Error(`Failed to fetch ${type}`);
            const users = await res.json();
            setFollowList(users);
            setShowFollowModal(type);
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
        } finally {
            setIsLoadingList(false);
        }
    };


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
                <div className="text-xl text-red-600">{error}</div>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
                <div className="text-xl text-red-600">User not found</div>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Image */}
            <div className="h-64 bg-gradient-to-r from-pink-500 via-purple-400 to-blue-500 relative">
                {user.coverImageUrl && (
                    <img
                        src={user.coverImageUrl}
                        alt="Cover"
                        className="w-full h-full object-cover absolute inset-0"
                    />
                )}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="relative -mt-16 mb-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex flex-col sm:flex-row items-center">
                            <img
                                src={user.imageUrl || 'https://via.placeholder.com/150'}
                                alt={user.name}
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                                        <p className="text-gray-600">{user.email}</p>
                                    </div>
                                    {currentUser?.id !== userId && (
                                        <button
                                            onClick={handleFollowToggle}
                                            disabled={isProcessing}
                                            className={`mt-4 sm:mt-0 px-6 py-2 rounded-full transition-colors ${
                                                isFollowing
                                                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {isProcessing ? (
                                                <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </span>
                                            ) : (
                                                isFollowing ? 'Unfollow' : 'Follow'
                                            )}
                                        </button>
                                    )}
                                </div>
                                {user.bio && (
                                    <p className="text-gray-700 mt-4 max-w-2xl">{user.bio}</p>
                                )}
                                {user.location && (
                                    <div className="flex items-center mt-4 text-gray-600">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {user.location}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                    {/* Posts Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts</h2>
                                <UserPosts userId={userId} />
                            </div>
                        </div>
                    </div>

                    {/* Skills and Stats Column */}
                    <div className="space-y-6">
                        {/* Skills Section */}
                        <div className="bg-white rounded-lg shadow-lg">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-0"></h2>
                                <SkillSection userId={userId} viewOnly={currentUser?.id !== userId} />
                            </div>
                        </div>

                        {/* Community Stats */}
                        <div className="bg-white rounded-lg shadow-lg">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Stats</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => fetchFollowList('followers')}
                                        className="bg-gray-50 p-4 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <span className="block text-3xl font-bold text-blue-600">{followStats.followers}</span>
                                        <span className="text-gray-600">Followers</span>
                                    </button>
                                    <button
                                        onClick={() => fetchFollowList('following')}
                                        className="bg-gray-50 p-4 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <span className="block text-3xl font-bold text-blue-600">{followStats.following}</span>
                                        <span className="text-gray-600">Following</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Follow Modal */}
            {showFollowModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-xl font-semibold">
                                {showFollowModal === 'followers' ? 'Followers' : 'Following'}
                            </h3>
                            <button
                                onClick={() => setShowFollowModal(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[60vh] p-4">
                            {isLoadingList ? (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            ) : followList.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">
                                    {showFollowModal === 'followers'
                                        ? 'No followers yet'
                                        : 'Not following anyone yet'}
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {followList.map(user => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                                            onClick={() => {
                                                setShowFollowModal(null);
                                                navigate(`/user/${user.id}`);
                                            }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={user.imageUrl || 'https://via.placeholder.com/40'}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-semibold">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfileView;