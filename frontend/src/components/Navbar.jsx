import React from 'react';
import { FaHome, FaUserFriends, FaBriefcase, FaEnvelope, FaBell, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-blue-950 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <Link to="/" className="text-white text-lg font-bold">
                    <img src="/path/to/logo.png" alt="Logo" className="w-8 h-8" />
                </Link>
            </div>
            <div className="flex items-center bg-gray-700 rounded-full px-3 py-1">
                <FaSearch className="text-gray-300 mr-2" />
                <input
                    type="text"
                    placeholder="Search"
                    className="bg-transparent text-white focus:outline-none w-64"
                />
            </div>
            <div className="flex items-center space-x-8">
                <Link to="/" className="flex flex-col items-center text-white hover:text-gray-400">
                    <FaHome size={20} />
                    <span className="text-xs">Home</span>
                </Link>
                <Link to="/network" className="flex flex-col items-center text-white hover:text-gray-400">
                    <FaUserFriends size={20} />
                    <span className="text-xs">Network</span>
                </Link>
                <Link to="/jobs" className="flex flex-col items-center text-white hover:text-gray-400">
                    <FaBriefcase size={20} />
                    <span className="text-xs">Jobs</span>
                </Link>
                <Link to="/messages" className="flex flex-col items-center text-white hover:text-gray-400">
                    <FaEnvelope size={20} />
                    <span className="text-xs">Messages</span>
                </Link>
                <Link to="/notifications" className="flex flex-col items-center text-white hover:text-gray-400">
                    <FaBell size={20} />
                    <span className="text-xs">Notifications</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;