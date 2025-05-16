import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { UserGroupIcon, UserPlusIcon, ChartBarIcon } from '@heroicons/react/24/solid';

const NetworkPage = () => {
    const [activeTab, setActiveTab] = useState('followers');
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [stats, setStats] = useState({
        totalFollowers: 0,
        totalFollowing: 0,
        mutualConnections: 0,
        recentlyActive: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const fetchNetworkData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [followersRes, followingRes] = await Promise.all([
                fetch(`http://localhost:8070/api/user/followers/${currentUser.id}`),
                fetch(`http://localhost:8070/api/user/following/${currentUser.id}`)
            ]);

            if (!followersRes.ok || !followingRes.ok) {
                throw new Error('Failed to fetch network data');
            }

            const followersData = await followersRes.json();
            const followingData = await followingRes.json();

            setFollowers(followersData || []);
            setFollowing(followingData || []);

            // Calculate stats
            const mutual = followersData.filter(follower =>
                followingData.some(following => following.id === follower.id)
            );

            setStats({
                totalFollowers: followersData.length,
                totalFollowing: followingData.length,
                mutualConnections: mutual.length,
                recentlyActive: followersData.filter(user => user.lastActive).length
            });
        } catch (error) {
            console.error('Error fetching network data:', error);
            setFollowers([]);
            setFollowing([]);
            setStats({
                totalFollowers: 0,
                totalFollowing: 0,
                mutualConnections: 0,
                recentlyActive: 0
            });
        } finally {
            setIsLoading(false);
        }
    }, [currentUser.id]);

    const searchUsers = useCallback(async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        try {
            setIsSearching(true);
            const res = await fetch(`http://localhost:8070/api/user/search-v2?query=${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error('Failed to search users');
            const data = await res.json();
            setSearchResults(data.filter(user => user.id !== currentUser.id));
        } catch (error) {
            console.error('Error searching users:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [currentUser.id]);

    useEffect(() => {
        fetchNetworkData();
    }, [fetchNetworkData]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery) {
                searchUsers(searchQuery);
                setActiveTab('search');
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, searchUsers]);

    const handleFollow = async (userId) => {
        try {
            const isCurrentlyFollowing = following.some((f) => f.id === userId);
            const endpoint = `http://localhost:8070/api/follow/${currentUser.id}/${userId}`;
            const method = isCurrentlyFollowing ? 'DELETE' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(isCurrentlyFollowing ? 'Failed to unfollow user' : 'Failed to follow user');
            }

            // Update local state immediately for better UX
            if (isCurrentlyFollowing) {
                setFollowing(prev => prev.filter(f => f.id !== userId));
                setStats(prev => ({
                    ...prev,
                    totalFollowing: prev.totalFollowing - 1
                }));
            } else {
                const userToAdd = searchResults.find(u => u.id === userId) ||
                    followers.find(f => f.id === userId) ||
                    users.find(u => u.id === userId);
                if (userToAdd) {
                    setFollowing(prev => [...prev, userToAdd]);
                    setStats(prev => ({
                        ...prev,
                        totalFollowing: prev.totalFollowing + 1
                    }));
                }
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3
            }
        }
    };

    const tabVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    const UserCard = ({ user, isFollowing }) => (
        <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow duration-200"
        >
            <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => navigate(`/user/${user.id}`)}>
                <img
                    src={user.imageUrl || 'https://via.placeholder.com/50'}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                />
                <div>
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {user.name}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email || ''}</p>
                    <p className="text-xs text-gray-400">{user.bio || 'No bio available'}</p>
                </div>
            </div>
            {user.id !== currentUser.id && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleFollow(user.id);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                        isFollowing
                            ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    {isFollowing ? 'Following' : 'Follow'}
                </button>
            )}
        </motion.div>
    );

    const StatCard = ({ icon: Icon, label, value }) => (
        <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center"
        >
            <Icon className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            <span className="text-sm text-gray-500">{label}</span>
        </motion.div>
    );

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Stats Section */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard icon={UserGroupIcon} label="Followers" value={stats.totalFollowers} />
                    <StatCard icon={UserPlusIcon} label="Following" value={stats.totalFollowing} />
                    <StatCard icon={UserGroupIcon} label="Mutual" value={stats.mutualConnections} />
                    <StatCard icon={ChartBarIcon} label="Recently Active" value={stats.recentlyActive} />
                </motion.div>

                {/* Search Section */}
                <motion.div variants={itemVariants} className="relative">
                    <div className="flex items-center bg-white rounded-full shadow-sm border border-gray-200">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 ml-4" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search users by name or email..."
                            className="w-full px-4 py-3 rounded-full focus:outline-none"
                        />
                    </div>
                </motion.div>

                {/* Tabs and Content */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            {['followers', 'following', 'search'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`${
                                        activeTab === tab
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={tabVariants}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                {isLoading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : activeTab === 'followers' ? (
                                    followers.length > 0 ? (
                                        followers.map((user) => (
                                            <UserCard
                                                key={user.id}
                                                user={user}
                                                isFollowing={following.some((f) => f.id === user.id)}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 py-8">No followers yet</p>
                                    )
                                ) : activeTab === 'following' ? (
                                    following.length > 0 ? (
                                        following.map((user) => (
                                            <UserCard
                                                key={user.id}
                                                user={user}
                                                isFollowing={true}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 py-8">Not following anyone yet</p>
                                    )
                                ) : (
                                    <>
                                        {isSearching ? (
                                            <div className="flex justify-center py-12">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                            </div>
                                        ) : searchQuery ? (
                                            searchResults.length > 0 ? (
                                                searchResults.map((user) => (
                                                    <UserCard
                                                        key={user.id}
                                                        user={user}
                                                        isFollowing={following.some((f) => f.id === user.id)}
                                                    />
                                                ))
                                            ) : (
                                                <p className="text-center text-gray-500 py-8">No users found</p>
                                            )
                                        ) : (
                                            <p className="text-center text-gray-500 py-8">Start typing to search users</p>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default NetworkPage;