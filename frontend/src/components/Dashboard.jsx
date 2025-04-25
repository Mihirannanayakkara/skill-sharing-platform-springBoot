import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { motion } from "framer-motion";
import { FiEdit2, FiMapPin, FiBriefcase, FiLink, FiMail, FiPhone, FiHeart, FiMessageSquare, FiShare2 } from "react-icons/fi";

const Dashboard = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'Software Engineer',
        location: 'San Francisco, CA',
        company: 'Tech Corp',
        website: 'www.johndoe.com',
        phone: '+1 (555) 123-4567',
        about: 'Passionate software engineer with 5+ years of experience in building scalable web applications. Focused on React, Node.js, and cloud technologies.',
    });

    const [posts, setPosts] = useState([
        {
            id: 1,
            content: "Just launched a new React project! #coding #webdev",
            likes: 124,
            comments: 18,
            shares: 5,
            date: "2h ago"
        },
        {
            id: 2,
            content: "Excited to announce that I'll be speaking at the upcoming JavaScript conference! #JSConf",
            likes: 89,
            comments: 24,
            shares: 12,
            date: "1d ago"
        }
    ]);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log('Decoded token:', decodedToken); // Debug log
                setUserData(prevState => ({
                    ...prevState,
                    firstName: decodedToken.firstName || localStorage.getItem('firstName') || '',
                    lastName: decodedToken.lastName || localStorage.getItem('lastName') || '',
                    email: decodedToken.email || localStorage.getItem('email') || '',
                }));
            } catch (error) {
                console.error('Error decoding token:', error);
                // Fallback to localStorage if token decoding fails
                setUserData(prevState => ({
                    ...prevState,
                    firstName: localStorage.getItem('firstName') || '',
                    lastName: localStorage.getItem('lastName') || '',
                    email: localStorage.getItem('email') || '',
                }));
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('email');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white shadow overflow-hidden sm:rounded-lg"
                >
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                {userData.firstName} {userData.lastName}
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">{userData.role}</p>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                            <FiEdit2 className="inline-block mr-2" />
                            Edit Profile
                        </button>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <FiMail className="mr-2" /> Email address
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.email}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <FiMapPin className="mr-2" /> Location
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.location}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <FiBriefcase className="mr-2" /> Company
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.company}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <FiLink className="mr-2" /> Website
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.website}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <FiPhone className="mr-2" /> Phone
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.phone}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">About</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userData.about}</dd>
                            </div>
                        </dl>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-8"
                >
                    <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
                    {posts.map((post) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white shadow sm:rounded-lg mb-4 p-4"
                        >
                            <p className="text-gray-800 mb-2">{post.content}</p>
                            <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                            <div className="flex space-x-4">
                                <button className="flex items-center text-gray-600 hover:text-blue-500 transition duration-300">
                                    <FiHeart className="mr-1" /> {post.likes}
                                </button>
                                <button className="flex items-center text-gray-600 hover:text-blue-500 transition duration-300">
                                    <FiMessageSquare className="mr-1" /> {post.comments}
                                </button>
                                <button className="flex items-center text-gray-600 hover:text-blue-500 transition duration-300">
                                    <FiShare2 className="mr-1" /> {post.shares}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </main>
        </div>
    );
};

export default Dashboard;