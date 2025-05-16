import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ViewMyPosts from "./ViewMyPosts.jsx";
import SkillSection from '../components/SkillSection';
import Certifications from '../components/Certifications';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
    const [showFollowModal, setShowFollowModal] = useState(null); // 'followers' or 'following' or null
    const [followList, setFollowList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const userId = JSON.parse(localStorage.getItem("user"))?.id;

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            navigate('/login');
            return;
        }
        setUser(userData);
        fetchUserDetails(userData.email);
        fetchFollowStats(userData.id);
    }, [navigate]);

    const fetchUserDetails = async (email) => {
        try {
            const res = await fetch(`http://localhost:8070/api/user/email/${email}`);
            if (!res.ok) throw new Error('Failed to fetch user details');
            const userData = await res.json();
            setUser(prev => ({ ...prev, ...userData }));
            localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFollowStats = async (userId) => {
        try {
            const res = await fetch(`http://localhost:8070/api/follow/stats/${userId}`);
            if (!res.ok) throw new Error('Failed to fetch follow stats');
            const stats = await res.json();
            setFollowStats(stats);
        } catch (error) {
            console.error('Error fetching follow stats:', error);
        }
    };

    const fetchFollowList = async (type) => {
        if (!user?.id) return;

        try {
            const endpoint = type === 'followers'
                ? `http://localhost:8070/api/user/followers/${user.id}`
                : `http://localhost:8070/api/user/following/${user.id}`;

            const res = await fetch(endpoint);
            if (!res.ok) throw new Error(`Failed to fetch ${type}`);
            const users = await res.json();
            setFollowList(users);
            setShowFollowModal(type);
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
        }
    };

    const handleUnfollow = async (targetUserId) => {
        try {
            const res = await fetch(`http://localhost:8070/api/follow/${user.id}/${targetUserId}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Failed to unfollow user');

            // Refresh lists and stats
            fetchFollowStats(user.id);
            fetchFollowList(showFollowModal);
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Cover Image */}
            <div
                className="h-64 bg-gradient-to-r from-pink-500 via-purple-400 to-blue-500 relative"
                style={{
                    backgroundImage: user?.coverImageUrl ? `url(${user.coverImageUrl})` : undefined
                }}
            >
                {user?.coverImageUrl && (
                    <img
                        src={user.coverImageUrl}
                        alt="Cover"
                        className="w-full h-full object-cover absolute inset-0"
                    />
                )}
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="relative -mt-16 mb-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex flex-col sm:flex-row items-center">
                            <img
                                src={user?.imageUrl || 'https://via.placeholder.com/150'}
                                alt={user?.name}
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                                    <button
                                        onClick={() => navigate('/edit-profile')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Edit Profile
                                    </button>
                                </div>
                                <p className="text-gray-600">{user?.email}</p>
                                {user?.bio && (
                                    <p className="text-gray-700 mt-4 max-w-2xl">{user.bio}</p>
                                )}
                                {user?.location && (
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
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Post</h2>
                                <ViewMyPosts userId={user?.id} limit={2} />
                                <div className="mt-4 text-center">
                                    <button
                                        onClick={() => navigate('/my-posts')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Show More Posts
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Certifications Section */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <Certifications userId={user?.id} isOwnProfile={true} />
                            </div>
                        </div>
                    </div>

                    {/* Skills and Stats Column */}
                    <div className="space-y-6">
                        {/* About Section */}
                        <div className="bg-white rounded-lg shadow-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">About</h2>
                                    <button
                                        onClick={() => navigate('/edit-profile')}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Edit Profile"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>
                                {user?.bio ? (
                                    <p className="text-gray-700">{user.bio}</p>
                                ) : (
                                    <p className="text-gray-500 italic">No bio added yet. Click the edit button to add one.</p>
                                )}
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="bg-white rounded-lg shadow-lg">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6"></h2>
                                <SkillSection userId={user?.id} viewOnly={false} />
                            </div>
                        </div>

                        {/* Community Stats */}
                        <div className="bg-white rounded-lg shadow-lg">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Stats</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => fetchFollowList('followers')}
                                        className="bg-gray-50 p-4 rounded-lg text-center hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="block text-3xl font-bold text-blue-600">{followStats.followers}</span>
                                        <span className="text-gray-600">Followers</span>
                                    </button>
                                    <button
                                        onClick={() => fetchFollowList('following')}
                                        className="bg-gray-50 p-4 rounded-lg text-center hover:bg-gray-100 transition-colors"
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
                            {followList.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">
                                    {showFollowModal === 'followers'
                                        ? 'No followers yet'
                                        : 'Not following anyone yet'}
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {followList.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
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
                                            {showFollowModal === 'following' && (
                                                <button
                                                    onClick={() => handleUnfollow(user.id)}
                                                    className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
                                                >
                                                    Unfollow
                                                </button>
                                            )}
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

export default ProfilePage;