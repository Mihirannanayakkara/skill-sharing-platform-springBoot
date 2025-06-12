import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ViewMyPosts from "./ViewMyPosts.jsx";
import SkillSection from '../components/SkillSection';
import CertificationSection from '../components/CertificationSection.jsx';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
    const [showFollowModal, setShowFollowModal] = useState(null); // 'followers' or 'following' or null
    const [followList, setFollowList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [courseLoading, setCourseLoading] = useState(true);
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
        fetchUserCourses(userData.id);
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

    const fetchUserCourses = async (userId) => {
        try {
            setCourseLoading(true);
            // Fetch enrolled courses
            const enrolledResponse = await fetch(`http://localhost:8070/api/dsrcourses/enrolled/${userId}`);
            if (!enrolledResponse.ok) throw new Error('Failed to fetch enrolled courses');
            const enrolledData = await enrolledResponse.json();

            // Fetch all available courses
            const allCoursesResponse = await fetch(`http://localhost:8070/api/dsrcourses`);
            if (!allCoursesResponse.ok) throw new Error('Failed to fetch available courses');
            const allCoursesData = await allCoursesResponse.json();

            // Calculate progress for enrolled courses
            const coursesWithProgress = enrolledData.map(course => {
                const totalLessons = course.lessons?.length || 0;
                const viewedLessons = course.lessonViewedMap?.[userId] ? 1 : 0;
                const progress = totalLessons > 0 ? (viewedLessons / totalLessons) * 100 : 0;

                return {
                    ...course,
                    progress: progress,
                    isEnrolled: true
                };
            });

            setEnrolledCourses(coursesWithProgress);
            setAvailableCourses(allCoursesData.filter(course =>
                !enrolledData.some(enrolled => enrolled.id === course.id)
            ));
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setCourseLoading(false);
        }
    };

    const handleEnroll = async (courseId) => {
        try {
            const response = await fetch(`http://localhost:8070/api/dsrcourses/${courseId}/enroll/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to enroll in course');

            // Refresh courses after enrollment
            await fetchUserCourses(userId);
        } catch (error) {
            console.error('Error enrolling in course:', error);
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

    const getColorScheme = (index) => {
        const schemes = [
            { bg: 'bg-blue-100', text: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700', progress: 'bg-blue-600' },
            { bg: 'bg-green-100', text: 'text-green-600', button: 'bg-green-600 hover:bg-green-700', progress: 'bg-green-600' },
            { bg: 'bg-purple-100', text: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700', progress: 'bg-purple-600' },
            { bg: 'bg-red-100', text: 'text-red-600', button: 'bg-red-600 hover:bg-red-700', progress: 'bg-red-600' },
            { bg: 'bg-yellow-100', text: 'text-yellow-600', button: 'bg-yellow-600 hover:bg-yellow-700', progress: 'bg-yellow-600' }
        ];
        return schemes[index % schemes.length];
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
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-medium ml-15 text-gray-500">My Posts</h2>
                                </div>
                                <div className="relative">
                                    <div className="mt-8">
                                        <ViewMyPosts userId={user?.id} limit={2} />
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <button
                                        onClick={() => navigate('/post/viewall')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Show More Posts
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Certification Section */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-6">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Certifications</h2>
                                <CertificationSection userId={user?.id} />
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

                        {/* Learning Progress Section */}
                        <div className="bg-white rounded-lg shadow-lg">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Progress</h2>

                                {courseLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Enrolled Courses */}
                                        {enrolledCourses.length > 0 && (
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold text-gray-900">Enrolled Courses</h3>
                                                {enrolledCourses.map((course, index) => {
                                                    const colorScheme = getColorScheme(index);
                                                    return (
                                                        <div key={course.id} className="border rounded-lg overflow-hidden">
                                                            <button
                                                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                                                onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <div className={`${colorScheme.bg} p-2 rounded-lg`}>
                                                                        <svg className={`w-6 h-6 ${colorScheme.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="text-left">
                                                                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                                                                        <span className="text-sm text-gray-500">Progress: {Math.round(course.progress)}%</span>
                                                                    </div>
                                                                </div>
                                                                <svg className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedCourse === course.id ? 'rotate-180' : ''}`}
                                                                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </button>
                                                            {expandedCourse === course.id && (
                                                                <div className="p-4 bg-gray-50 border-t">
                                                                    <div className="mb-4">
                                                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                                            <div
                                                                                className={`${colorScheme.progress} h-2.5 rounded-full`}
                                                                                style={{ width: `${course.progress}%` }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-gray-600 mb-4">{course.description}</p>
                                                                    <div className="space-y-2 mb-4">
                                                                        <div className="flex items-center text-sm text-gray-600">
                                                                            <span className="font-medium mr-2">Instructor:</span>
                                                                            {course.instructorName}
                                                                        </div>
                                                                        <div className="flex items-center text-sm text-gray-600">
                                                                            <span className="font-medium mr-2">Level:</span>
                                                                            {course.skillLevel}
                                                                        </div>
                                                                        <div className="flex items-center text-sm text-gray-600">
                                                                            <span className="font-medium mr-2">Duration:</span>
                                                                            {course.duration}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex space-x-3">
                                                                        <button
                                                                            onClick={() => navigate(`/course/${course.id}`)}
                                                                            className={`px-4 py-2 text-white rounded-lg transition-colors ${colorScheme.button}`}
                                                                        >
                                                                            Continue Learning
                                                                        </button>
                                                                        <button
                                                                            onClick={() => navigate(`/course/${course.id}/details`)}
                                                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                                        >
                                                                            View Details
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Available Courses */}
                                        {availableCourses.length > 0 && (
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold text-gray-900">Available Courses</h3>
                                                {availableCourses.map((course, index) => (
                                                    <div key={course.id} className="border rounded-lg overflow-hidden">
                                                        <div className="p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className={`${getColorScheme(index).bg} p-2 rounded-lg`}>
                                                                        <svg className={`w-6 h-6 ${getColorScheme(index).text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                                                                        <p className="text-sm text-gray-500">{course.skillLevel} • {course.duration}</p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleEnroll(course.id)}
                                                                    className={`px-2 py-2 ${getColorScheme(index).button} text-white rounded-lg transition-colors`}
                                                                >
                                                                    Enroll
                                                                </button>
                                                            </div>
                                                            <p className="mt-2 text-sm text-gray-600">{course.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {enrolledCourses.length === 0 && availableCourses.length === 0 && (
                                            <div className="text-center py-8 text-gray-500">
                                                <p className="mb-4">No courses available at the moment.</p>
                                                <button
                                                    onClick={() => navigate('/learningplan')}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    View Learning Plan
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => navigate('/learning-progress')}
                                        className="px-3 py-2 mt-5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        View Learning Plan
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