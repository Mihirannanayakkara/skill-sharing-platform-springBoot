import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Camera, MapPin, Calendar, Heart, MessageCircle, Share2, Users, UserPlus } from 'lucide-react';

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
    const [activeTab, setActiveTab] = useState('posts');
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user profile
                const userResponse = await fetch(`http://localhost:8070/api/user/${userId}`);
                if (!userResponse.ok) throw new Error('Failed to fetch user data');
                const userData = await userResponse.json();
                setUser(userData);

                // Fetch user's posts
                const postsResponse = await fetch(`http://localhost:8070/api/media/user/${userId}`);
                if (!postsResponse.ok) throw new Error('Failed to fetch user posts');
                const postsData = await postsResponse.json();
                setUserPosts(postsData);

                // Fetch follow stats
                const statsResponse = await fetch(`http://localhost:8070/api/follow/stats/${userId}`);
                if (statsResponse.ok) {
                    const statsData = await statsResponse.json();
                    setFollowStats(statsData);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 relative animate-spin">
                        <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-indigo-200 opacity-20"></div>
                        <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-pulse"></div>
                    </div>
                    <p className="text-indigo-600 font-medium animate-pulse">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <div className="inline-flex mb-6 p-4 bg-red-50 rounded-full">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Unable to Load Profile</h2>
                    <p className="text-gray-600 mb-6">{error || 'User not found'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const isCurrentUserProfile = currentUser && currentUser._id === user._id;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300">
            {/* Cover Image with Parallax Effect */}
            <div className="relative h-72 md:h-96 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-500"
                    style={{
                        backgroundImage: user.coverImageUrl
                            ? `url(${user.coverImageUrl})`
                            : 'url(https://via.placeholder.com/1920x400)',
                        transformOrigin: 'center center',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40"></div>
            </div>

            {/* Profile Info */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-32">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl animate-fadeIn">
                    <div className="relative p-6 md:p-8">
                        {/* Profile Picture with Floating Animation */}
                        <div className="flex flex-col md:flex-row md:items-end">
                            <div className="relative mb-4 md:mb-0">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden animate-float">
                                    <img
                                        src={user.imageUrl || 'https://via.placeholder.com/150'}
                                        alt={user.name}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>
                                {isCurrentUserProfile && (
                                    <button className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700 transition-colors duration-300">
                                        <Camera size={16} />
                                    </button>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="md:ml-6 flex-1">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 animate-fadeInUp">{user.name}</h1>
                                        <p className="text-gray-600 opacity-0 animate-fadeInUp animation-delay-100">{user.email}</p>
                                    </div>

                                    {!isCurrentUserProfile && (
                                        <button className="mt-4 md:mt-0 px-6 py-2 bg-indigo-600 text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg opacity-0 animate-fadeInUp animation-delay-300">
                                            <UserPlus size={18} />
                                            <span>Follow</span>
                                        </button>
                                    )}

                                    {isCurrentUserProfile && (
                                        <button className="mt-4 md:mt-0 px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg opacity-0 animate-fadeInUp animation-delay-300">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                            </svg>
                                            <span>Edit Profile</span>
                                        </button>
                                    )}
                                </div>

                                {user.bio && (
                                    <p className="mt-3 text-gray-700 opacity-0 animate-fadeInUp animation-delay-200">
                                        {user.bio}
                                    </p>
                                )}

                                {/* User Metadata */}
                                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 opacity-0 animate-fadeInUp animation-delay-300">
                                    {user.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} className="text-gray-400" />
                                            <span>{user.location}</span>
                                        </div>
                                    )}
                                    {user.joinDate && (
                                        <div className="flex items-center gap-1">
                                            <Calendar size={16} className="text-gray-400" />
                                            <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Follow Stats with Hover Animation */}
                                <div className="mt-6 flex space-x-4 md:space-x-8 opacity-0 animate-fadeInUp animation-delay-400">
                                    <div className="group cursor-pointer transition-all duration-300 hover:bg-indigo-50 px-3 py-1 rounded-full">
                                        <span className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">{followStats.followers}</span>
                                        <span className="ml-1 text-gray-600 group-hover:text-indigo-500 transition-colors duration-300">Followers</span>
                                    </div>
                                    <div className="group cursor-pointer transition-all duration-300 hover:bg-indigo-50 px-3 py-1 rounded-full">
                                        <span className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">{followStats.following}</span>
                                        <span className="ml-1 text-gray-600 group-hover:text-indigo-500 transition-colors duration-300">Following</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="mt-8 border-t border-gray-200 pt-4 opacity-0 animate-fadeInUp animation-delay-500">
                            <div className="flex overflow-x-auto scrollbar-hide">
                                <button
                                    onClick={() => setActiveTab('posts')}
                                    className={`px-4 py-2 font-medium text-sm transition-colors duration-300 border-b-2 ${
                                        activeTab === 'posts'
                                            ? 'border-indigo-600 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Posts
                                </button>
                                <button
                                    onClick={() => setActiveTab('photos')}
                                    className={`px-4 py-2 font-medium text-sm transition-colors duration-300 border-b-2 ${
                                        activeTab === 'photos'
                                            ? 'border-indigo-600 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Photos
                                </button>
                                <button
                                    onClick={() => setActiveTab('videos')}
                                    className={`px-4 py-2 font-medium text-sm transition-colors duration-300 border-b-2 ${
                                        activeTab === 'videos'
                                            ? 'border-indigo-600 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Videos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User's Posts */}
                <div className="mt-6 opacity-0 animate-fadeInUp animation-delay-600">
                    <div className="space-y-6">
                        {userPosts.length > 0 ? (
                            userPosts.map((post, index) => (
                                <div
                                    key={post._id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 opacity-0 animate-fadeInUp"
                                    style={{ animationDelay: `${600 + index * 100}ms` }}
                                >
                                    {/* Post Header */}
                                    <div className="p-4 flex items-center space-x-3">
                                        <img
                                            src={user.imageUrl || 'https://via.placeholder.com/40'}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500">{new Date(post.createdAt || Date.now()).toLocaleDateString()}</div>
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    {post.description && (
                                        <div className="px-4 pb-3">
                                            <p className="text-gray-800">{post.description}</p>
                                        </div>
                                    )}

                                    {/* Media Content with Hover Zoom */}
                                    <div className="relative overflow-hidden">
                                        {post.mediaType === 'IMAGE' && post.imageUrls?.[0] && (
                                            <img
                                                src={post.imageUrls[0]}
                                                alt="Post content"
                                                className="w-full h-auto transition-transform duration-700 hover:scale-105"
                                            />
                                        )}
                                        {post.mediaType === 'VIDEO' && (
                                            <video
                                                src={post.videoUrl}
                                                className="w-full"
                                                controls
                                                preload="metadata"
                                            />
                                        )}
                                    </div>

                                    {/* Post Actions */}
                                    <div className="px-4 py-3 border-t border-gray-100 flex justify-between">
                                        <div className="flex space-x-6">
                                            <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors duration-300">
                                                <Heart size={18} />
                                                <span className="text-sm">Like</span>
                                            </button>
                                            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors duration-300">
                                                <MessageCircle size={18} />
                                                <span className="text-sm">Comment</span>
                                            </button>
                                        </div>
                                        <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors duration-300">
                                            <Share2 size={18} />
                                            <span className="text-sm">Share</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center opacity-0 animate-fadeInUp animation-delay-600">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No posts yet</h3>
                                <p className="text-gray-500">When {isCurrentUserProfile ? 'you create' : 'this user creates'} new posts, they will appear here.</p>

                                {isCurrentUserProfile && (
                                    <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full font-medium flex items-center justify-center gap-2 mx-auto hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                        <span>Create Your First Post</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
};

export default UserProfile;