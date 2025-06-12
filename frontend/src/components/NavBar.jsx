import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHome, FaUserFriends, FaBriefcase, FaEnvelope, FaSearch, FaUser, FaTasks, FaSignOutAlt } from 'react-icons/fa';
import NotificationBell from './NotificationBell.jsx';
import modernLogo from '../assets/Black and White Modern Personal Brand Logo (1).png';

const NavBar = () => {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const searchUsers = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:8070/api/user/search-v2?query=${searchQuery}`);
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Error searching users:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            searchUsers();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleSearchFocus = () => {
        setShowResults(true);
    };

    const handleUserClick = (userId) => {
        navigate(`/user/${userId}`);
        setShowResults(false);
        setSearchQuery('');
    };

    return (
        <nav className="bg-blue-950 text-white p-4 flex justify-between items-center fixed w-full top-0 z-50">
            <div className="flex items-center space-x-4">
                <Link to="/post/viewall" className="text-white text-lg font-bold">
                    <img src={modernLogo} alt="Logo" className="w-14 h-14" /> {/* Use the imported image */}
                </Link>
            </div>
            <div className="relative flex-1 max-w-2xl mx-auto" ref={searchRef}>
                <div className="flex items-center bg-gray-700 rounded-full px-3 py-1">
                    <FaSearch className="text-gray-300 mr-2" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={handleSearchFocus}
                        className="bg-transparent text-white placeholder-gray-300 focus:outline-none w-full"
                    />
                    {isLoading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-white"></div>
                    )}
                </div>

                {/* Search Results Dropdown */}
                {showResults && (searchResults.length > 0 || isLoading) && (
                    <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                        {isLoading ? (
                            <div className="p-4 text-center text-gray-600">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mx-auto"></div>
                            </div>
                        ) : (
                            searchResults.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    onClick={() => handleUserClick(user.id)}
                                >
                                    <img
                                        src={user.imageUrl || 'https://via.placeholder.com/40'}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUserClick(user.id);
                                        }}
                                        className="ml-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            <div className="flex items-center space-x-8">
                <Link to="/post/viewall" className="flex flex-col items-center text-white hover:text-gray-400 transition-colors">
                    <FaHome size={20} />
                    <span className="text-xs mt-1">Home</span>
                </Link>
                <Link to="/network" className="flex flex-col items-center text-white hover:text-gray-400 transition-colors">
                    <FaUserFriends size={20} />
                    <span className="text-xs mt-1">Network</span>
                </Link>
                <Link to="/learningplan" className="flex flex-col items-center text-white hover:text-gray-400 transition-colors">
                    <FaTasks size={20} />
                    <span className="text-xs mt-1">Tasks</span>
                </Link>
                <Link to="/profile" className="flex flex-col items-center text-white hover:text-gray-400 transition-colors">
                    <FaUser size={20} />
                    <span className="text-xs mt-1">Profile</span>
                </Link>
                <NotificationBell />
                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center text-white hover:text-gray-400 transition-colors"
                >
                    <FaSignOutAlt size={20} />
                    <span className="text-xs mt-1">Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default NavBar;