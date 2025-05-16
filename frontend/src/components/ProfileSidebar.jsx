import React, { useState, useEffect } from 'react';
import { FaBookmark, FaUsers, FaPen, FaGraduationCap, FaCertificate, FaUserFriends, FaCalendarAlt, FaSearch, FaBriefcase, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { eventEmitter } from '../utils/eventEmitter';
import Modal from './Modal';

const ProfileSidebar = ({ user }) => {
    const [userStats, setUserStats] = useState({
        following: 0,
        followers: 0,
        savedPosts: 0,
        skills: []
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSkillsModal, setShowSkillsModal] = useState(false);
    const [showFollowModal, setShowFollowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('followers');
    const [followData, setFollowData] = useState({
        followers: [],
        following: []
    });
    const [loadingFollow, setLoadingFollow] = useState(false);
    const [processingUnfollow, setProcessingUnfollow] = useState(null);

    const navigate = useNavigate();
    const currentUser = user || JSON.parse(localStorage.getItem('user'));

    // Update placeholder image URL to a more reliable source
    const DEFAULT_AVATAR = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%23ccc" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/%3E%3C/svg%3E';
    const DEFAULT_COVER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200"%3E%3Crect width="800" height="200" fill="%23f0f0f0"/%3E%3C/svg%3E';

    const fetchUserStats = async () => {
        try {
            setLoading(true);
            const [followStats, savedStats, skillsRes] = await Promise.all([
                fetch(`http://localhost:8070/api/follow/stats/${currentUser.id}`).then(res => res.json()),
                fetch(`http://localhost:8070/api/saved/count?userId=${currentUser.id}`).then(res => res.json()),
                fetch(`http://localhost:8070/api/skills/${currentUser.id}`).then(res => res.json())
            ]);

            setUserStats({
                following: followStats.following || 0,
                followers: followStats.followers || 0,
                savedPosts: savedStats.count || 0,
                skills: skillsRes || []
            });
        } catch (error) {
            console.error('Error fetching user stats:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchFollowData = async () => {
        try {
            setLoadingFollow(true);
            const [followersRes, followingRes] = await Promise.all([
                fetch(`http://localhost:8070/api/user/followers/${currentUser.id}`).then(res => res.json()),
                fetch(`http://localhost:8070/api/user/following/${currentUser.id}`).then(res => res.json())
            ]);

            setFollowData({
                followers: followersRes || [],
                following: followingRes || []
            });
        } catch (error) {
            console.error('Error fetching follow data:', error);
        } finally {
            setLoadingFollow(false);
        }
    };

    useEffect(() => {
        if (currentUser?.id) {
            fetchUserStats();
        }
    }, [currentUser?.id]);

    useEffect(() => {
        const handleSavedPostsUpdate = (data) => {
            setUserStats(prev => ({
                ...prev,
                savedPosts: data.count
            }));
        };

        eventEmitter.on('savedPostsUpdated', handleSavedPostsUpdate);

        return () => {
            eventEmitter.off('savedPostsUpdated', handleSavedPostsUpdate);
        };
    }, []);

    const handleUnfollow = async (userToUnfollow) => {
        setProcessingUnfollow(userToUnfollow.id);
        try {
            const response = await fetch(`http://localhost:8070/api/follow/${currentUser.id}/${userToUnfollow.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to unfollow user');
            }

            // Update local state
            setFollowData(prev => ({
                ...prev,
                following: prev.following.filter(user => user.id !== userToUnfollow.id)
            }));
            // Update stats
            setUserStats(prev => ({
                ...prev,
                following: prev.following - 1
            }));
        } catch (error) {
            console.error('Error unfollowing user:', error);
        } finally {
            setProcessingUnfollow(null);
        }
    };

    // Skills Modal Component
    const SkillsModal = () => (
        <Modal isOpen={showSkillsModal} onClose={() => setShowSkillsModal(false)} width="max-w-2xl">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">Your Skills</h3>
                        <p className="text-gray-600 mt-1">Showcase your expertise and talents</p>
                    </div>
                    <button
                        onClick={() => setShowSkillsModal(false)}
                        className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>
                {userStats.skills.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {userStats.skills.map((skill, index) => {
                            const colorScheme = skillColors[index % skillColors.length];
                            return (
                                <div
                                    key={index}
                                    className={`${colorScheme.bg} ${colorScheme.text} p-4 rounded-xl flex items-center justify-between group transition-all duration-200 hover:shadow-md`}
                                >
                                    <span className="font-medium">{skill.name}</span>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        className={`${colorScheme.text} ${colorScheme.hover}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                        </svg>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaPen className="text-blue-600 text-xl" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No skills added yet</h4>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            Add your skills to showcase your expertise and connect with others who share your interests
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );

    // Follow Modal Component
    const FollowModal = () => {
        const activeList = followData[activeTab] || [];

        return (
            <Modal isOpen={showFollowModal} onClose={() => setShowFollowModal(false)} width="max-w-2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setActiveTab('followers')}
                                className={`text-sm font-medium ${activeTab === 'followers'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Followers ({followData.followers.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('following')}
                                className={`text-sm font-medium ${activeTab === 'following'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Following ({followData.following.length})
                            </button>
                        </div>
                        <button
                            onClick={() => setShowFollowModal(false)}
                            className="text-gray-500 hover:text-gray-700 text-xl"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="overflow-y-auto max-h-[60vh] mt-2">
                        {loadingFollow ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : activeList.length > 0 ? (
                            <div className="space-y-4">
                                {activeList.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                                    >
                                        <div
                                            className="flex items-center space-x-3 cursor-pointer"
                                            onClick={() => {
                                                navigate(`/user/${user.id}`);
                                                setShowFollowModal(false);
                                            }}
                                        >
                                            <img
                                                src={user.profileImage || DEFAULT_AVATAR}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full object-cover bg-gray-100"
                                                onError={(e) => {
                                                    e.target.src = DEFAULT_AVATAR;
                                                }}
                                            />
                                            <div>
                                                <h4 className="font-medium text-gray-900">{user.name}</h4>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                                <p className="text-xs text-gray-400">{user.title || 'User'}</p>
                                            </div>
                                        </div>
                                        {activeTab === 'following' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUnfollow(user);
                                                }}
                                                disabled={processingUnfollow === user.id}
                                                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                                    processingUnfollow === user.id
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                                                }`}
                                            >
                                                {processingUnfollow === user.id ? (
                                                    <span className="flex items-center">
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Unfollowing...
                                                    </span>
                                                ) : (
                                                    'Unfollow'
                                                )}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No {activeTab} yet
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        );
    };

    if (loading) {
        return (
            <div className="space-y-1 max-w-xs animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-1 max-w-xs">
                <div className="bg-red-50 p-4 rounded-lg text-red-600">
                    Error loading profile data. Please try again later.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Profile Header */}
            <div className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 relative">
                <img
                    src={currentUser.coverImageUrl || DEFAULT_COVER}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-75"
                    onError={(e) => {
                        e.target.src = DEFAULT_COVER;
                    }}
                />
            </div>

            {/* Profile Section */}
            <div className="px-4 py-2">
                {/* Profile Image and Info */}
                <div className="flex items-start space-x-3">
                    <Link to={`/user/${currentUser.id}`}>
                        <img
                            src={currentUser.profileImage || DEFAULT_AVATAR}
                            alt={currentUser.name || "Profile"}
                            className="w-16 h-16 rounded-full object-cover border border-gray-200 bg-gray-100"
                            onError={(e) => {
                                e.target.src = DEFAULT_AVATAR;
                            }}
                        />
                    </Link>
                    <div className="flex-1">
                        <Link
                            to={`/user/${currentUser.id}`}
                            className="group"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                                {currentUser.name || 'User'}
                            </h3>
                        </Link>
                        <p className="text-sm text-gray-600">{currentUser.email}</p>
                        <p className="text-sm text-gray-500 mt-1">{currentUser.bio || 'Hi Guys Im Rshaul;'}</p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                    <button
                        onClick={() => {
                            setActiveTab('following');
                            setShowFollowModal(true);
                            fetchFollowData();
                        }}
                        className="hover:text-blue-600 transition-colors"
                    >
                        <span className="font-medium">{userStats.following}</span> following
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('followers');
                            setShowFollowModal(true);
                            fetchFollowData();
                        }}
                        className="hover:text-blue-600 transition-colors"
                    >
                        <span className="font-medium">{userStats.followers}</span> followers
                    </button>
                </div>

                {/* Your Professional Growth Section */}
                <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Your Professional Growth</h4>
                    <div className="space-y-4">
                        <button
                            onClick={() => setShowSkillsModal(true)}
                            className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                                    <FaPen className="text-blue-600 text-lg" />
                                </div>
                                <div className="text-left">
                                    <span className="text-base font-medium text-gray-800 block">Skills</span>
                                    <span className="text-sm text-gray-500">{userStats.skills.length} skills added</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-base font-medium text-gray-800">{userStats.skills.length}</span>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </div>
                        </button>
                        <div className="flex justify-between items-center p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 group">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-200">
                                    <FaCertificate className="text-purple-600 text-lg" />
                                </div>
                                <div className="text-left">
                                    <span className="text-base font-medium text-gray-800 block">Certifications</span>
                                    <span className="text-sm text-gray-500">Add your certifications</span>
                                </div>
                            </div>
                            <span className="text-base font-medium text-gray-800">0</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg hover:bg-green-50 transition-colors duration-200 group">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
                                    <FaGraduationCap className="text-green-600 text-lg" />
                                </div>
                                <div className="text-left">
                                    <span className="text-base font-medium text-gray-800 block">Education</span>
                                    <span className="text-sm text-gray-500">Add your education</span>
                                </div>
                            </div>
                            <span className="text-base font-medium text-gray-800">0</span>
                        </div>
                    </div>
                </div>

                {/* Resources Section */}
                <div className="mt-3">
                    <h4 className="text-sm font-medium mb-2">Resources</h4>
                    <div className="space-y-1">
                        <button
                            onClick={() => navigate('/saved-items')}
                            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 w-full"
                        >
                            <FaBookmark className="text-gray-400 text-xs" />
                            <span className="text-sm">Saved items</span>
                        </button>
                        <button
                            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 w-full"
                        >
                            <FaUserFriends className="text-gray-400 text-xs" />
                            <span className="text-sm">Groups</span>
                        </button>
                        <button
                            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 w-full"
                        >
                            <FaCalendarAlt className="text-gray-400 text-xs" />
                            <span className="text-sm">Events</span>
                        </button>
                    </div>
                </div>

                {/* Discover more Section */}
                <div className="mt-3">
                    <h4 className="text-sm font-medium mb-2">Discover more</h4>
                    <div className="space-y-1">
                        <button
                            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 w-full"
                        >
                            <FaSearch className="text-gray-400 text-xs" />
                            <span className="text-sm">Explore skills in your network</span>
                        </button>
                        <button
                            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 w-full"
                        >
                            <FaBriefcase className="text-gray-400 text-xs" />
                            <span className="text-sm">Find job opportunities</span>
                        </button>
                        <button
                            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 w-full"
                        >
                            <FaUsers className="text-gray-400 text-xs" />
                            <span className="text-sm">Connect with mentors</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <SkillsModal />
            <FollowModal />
        </div>
    );
};

export default ProfileSidebar;