
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiCode, FiBook, FiShare2 } from 'react-icons/fi';
import Notification from './Notification';
const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        education: '',
        skills: '',
        bio: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                education: formData.education,
                skills: formData.skills,
                bio: formData.bio
            });
            console.log('Registration successful', response.data);
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error.response?.data);
            if (error.response && error.response.status === 400) {
                if (error.response.data && error.response.data.message && error.response.data.message.toLowerCase().includes('email already exists')) {
                    setError('Email already exists. Please use a different email address.');
                } else {
                    setError(error.response.data.message || 'Registration failed. Please check your information and try again.');
                }
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="w-1/2 p-12 text-white flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold mb-12 text-center">Skill Share Platform</h1>
                <div className="space-y-12 max-w-md">
                    <div className="flex items-center space-x-6">
                        <div className="bg-blue-500 p-4 rounded-full">
                            <FiUser className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold">Connect with Experts</h2>
                            <p className="text-gray-300 mt-2">Learn from industry professionals and expand your network.</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="bg-green-500 p-4 rounded-full">
                            <FiCode className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold">Enhance Your Skills</h2>
                            <p className="text-gray-300 mt-2">Access a wide range of courses and workshops to boost your expertise.</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="bg-yellow-500 p-4 rounded-full">
                            <FiShare2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold">Share Your Knowledge</h2>
                            <p className="text-gray-300 mt-2">Contribute your expertise and help others grow in their careers.</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="bg-red-500 p-4 rounded-full">
                            <FiBook className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold">Lifelong Learning</h2>
                            <p className="text-gray-300 mt-2">Stay updated with the latest trends and technologies in your field.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-1/2 p-12 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg overflow-y-auto">
                <div className="max-w-md mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-6">Create your account</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-400">First name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-400">Last name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    id="lastName"
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email address</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                autoComplete="new-password"
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                autoComplete="new-password"
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="education" className="block text-sm font-medium text-gray-400">Education</label>
                            <input
                                type="text"
                                name="education"
                                id="education"
                                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="skills" className="block text-sm font-medium text-gray-400">Skills</label>
                            <input
                                type="text"
                                name="skills"
                                id="skills"
                                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-400">Bio</label>
                            <textarea
                                name="bio"
                                id="bio"
                                rows="3"
                                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm mt-2 bg-red-100 border border-red-400 rounded-md p-3">
                                {error}
                            </div>
                        )}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                    <p className="mt-10 text-center text-sm text-gray-400">
                        Already have an account?
                        <Link to="/login" className="font-medium text-blue-500 hover:text-blue-400 ml-1 transition duration-150 ease-in-out">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;