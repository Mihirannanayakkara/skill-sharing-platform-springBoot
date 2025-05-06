import React, { useEffect } from 'react';
import { FaBookmark, FaUsers, FaNewspaper, FaCalendarAlt, FaShieldAlt, FaPen, FaEye, FaBriefcase, FaGraduationCap, FaCertificate } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const ProfileSidebar = ({ user }) => {
    // Default user data if not provided
    const defaultUser = {
        name: 'Rahul Nanayakkara',
        title: 'Undergraduate at SLIIT',
        location: 'Galle District, Southern Province',
        organization: 'SLIIT',
        postCount: 12,
        connections: 86,
        followers: 540,
        profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        skills: ['JavaScript', 'React.js', 'Java', 'Spring Boot'],
        certifications: 3,
        education: ['BSc in Software Engineering, SLIIT']
    };

    const userData = user || defaultUser;
    const navigate = useNavigate();

    // Ensure these properties exist to prevent "length of undefined" errors
    const skills = userData.skills || [];
    const education = userData.education || [];
    const certifications = userData.certifications || 0;

    // Log for debugging
    useEffect(() => {
        console.log("ProfileSidebar rendered with user data:", userData);
    }, [userData]);

    // Handle profile navigation with error prevention
    const handleProfileNavigation = (e, path) => {
        e.preventDefault();
        console.log("Navigating to:", path);
        navigate(path);
    };

    return (
        <div className="space-y-3 max-w-xs">
            {/* Profile Card */}
            <motion.div
                className="bg-white rounded-lg shadow-sm overflow-hidden"
                whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.2 }}
            >
                {/* Profile Content */}
                <div className="p-4">
                    <div className="flex items-start space-x-3">
                        {/* Profile Image */}
                        <img
                            src={userData.profileImage}
                            alt={userData.name}
                            className="w-14 h-14 rounded-full border border-gray-200 object-cover"
                        />

                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <button
                                        onClick={(e) => handleProfileNavigation(e, '/profile')}
                                        className="hover:underline text-left"
                                    >
                                        <h2 className="text-base font-bold text-gray-800">{userData.name}</h2>
                                    </button>
                                    <p className="text-gray-600 text-xs">{userData.title}</p>
                                    <p className="text-gray-500 text-xs mt-1">{userData.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center">
                                <FaUsers className="text-gray-400 mr-1" size={10} />
                                <span className="text-gray-600">{userData.connections || 0} connections</span>
                            </div>
                            <div className="flex items-center">
                                <FaEye className="text-gray-400 mr-1" size={10} />
                                <span className="text-gray-600">{userData.followers || 0} followers</span>
                            </div>
                        </div>
                    </div>


                </div>
            </motion.div>

            {/* Skills & Certifications Summary */}
            <motion.div
                className="bg-white rounded-lg shadow-sm p-3"
                whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.2 }}
            >
                <h3 className="text-xs font-medium mb-2">Your Professional Growth</h3>
                <div className="space-y-2.5">
                    <button
                        onClick={(e) => handleProfileNavigation(e, '/profile#skills')}
                        className="flex items-center justify-between text-gray-700 hover:text-blue-600 text-xs w-full"
                    >
                        <div className="flex items-center">
                            <FaPen className="mr-2 text-gray-500" size={12} />
                            <span>Skills</span>
                        </div>
                        <span className="text-gray-500">{skills.length}</span>
                    </button>

                    <button
                        onClick={(e) => handleProfileNavigation(e, '/profile#certifications')}
                        className="flex items-center justify-between text-gray-700 hover:text-blue-600 text-xs w-full"
                    >
                        <div className="flex items-center">
                            <FaCertificate className="mr-2 text-gray-500" size={12} />
                            <span>Certifications</span>
                        </div>
                        <span className="text-gray-500">{certifications}</span>
                    </button>

                    <button
                        onClick={(e) => handleProfileNavigation(e, '/profile#education')}
                        className="flex items-center justify-between text-gray-700 hover:text-blue-600 text-xs w-full"
                    >
                        <div className="flex items-center">
                            <FaGraduationCap className="mr-2 text-gray-500" size={12} />
                            <span>Education</span>
                        </div>
                        <span className="text-gray-500">{education.length}</span>
                    </button>
                </div>
            </motion.div>

            {/* Resources Card */}
            <motion.div
                className="bg-white rounded-lg shadow-sm p-3"
                whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.2 }}
            >
                <h3 className="text-xs font-medium mb-2">Resources</h3>
                <div className="space-y-2.5">
                    <button
                        onClick={(e) => handleProfileNavigation(e, '/saved-items')}
                        className="flex items-center text-gray-700 hover:text-blue-600 text-xs w-full text-left"
                    >
                        <FaBookmark className="mr-2 text-gray-500" size={12} />
                        <span>Saved items</span>
                    </button>

                    <button
                        onClick={(e) => handleProfileNavigation(e, '/groups')}
                        className="flex items-center text-gray-700 hover:text-blue-600 text-xs w-full text-left"
                    >
                        <FaUsers className="mr-2 text-gray-500" size={12} />
                        <span>Groups</span>
                    </button>

                    <button
                        onClick={(e) => handleProfileNavigation(e, '/newsletters')}
                        className="flex items-center text-gray-700 hover:text-blue-600 text-xs w-full text-left"
                    >
                        <FaNewspaper className="mr-2 text-gray-500" size={12} />
                        <span>Newsletters</span>
                    </button>

                    <button
                        onClick={(e) => handleProfileNavigation(e, '/events')}
                        className="flex items-center text-gray-700 hover:text-blue-600 text-xs w-full text-left"
                    >
                        <FaCalendarAlt className="mr-2 text-gray-500" size={12} />
                        <span>Events</span>
                    </button>
                </div>
            </motion.div>

            {/* Discover More */}
            <motion.div
                className="bg-white rounded-lg shadow-sm p-3"
                whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.2 }}
            >
                <h3 className="text-xs font-medium mb-2">Discover more</h3>
                <div className="space-y-2">
                    <button
                        onClick={(e) => handleProfileNavigation(e, '/skills')}
                        className="text-blue-600 text-xs hover:underline block w-full text-left"
                    >
                        Explore skills in your network
                    </button>
                    <button
                        onClick={(e) => handleProfileNavigation(e, '/jobs')}
                        className="text-blue-600 text-xs hover:underline block w-full text-left"
                    >
                        Find job opportunities
                    </button>
                    <button
                        onClick={(e) => handleProfileNavigation(e, '/mentors')}
                        className="text-blue-600 text-xs hover:underline block w-full text-left"
                    >
                        Connect with mentors
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfileSidebar;