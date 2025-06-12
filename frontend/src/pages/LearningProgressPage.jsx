import React, { useState } from 'react';
import SkillSection from '../components/SkillSection';
import CertificationSection from '../components/CertificationSection';
import CourseProgress from '../components/CourseProgress';
import UserProfileHeader from '../components/UserProfileHeader';
import { useNavigate } from "react-router-dom";
import ShareLearningPlan from './ShareLearningPlan';
import { FaGraduationCap, FaCertificate, FaChartLine, FaShare, FaBookReader, FaTrophy } from 'react-icons/fa';

const LearningProgressPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('progress');
    const userId = JSON.parse(localStorage.getItem("user"))?.id;

    const tabs = [
        { id: 'progress', label: 'Course Progress', icon: FaChartLine },
        { id: 'skills', label: 'Skills', icon: FaBookReader },
        { id: 'certifications', label: 'Certifications', icon: FaCertificate }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-950 to-blue-800 text-white py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-4">Learning Progress</h1>


                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-lg">
                            <div className="flex items-center">
                                <FaGraduationCap className="text-3xl text-blue-200" />
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold">Courses</h3>
                                    <p className="text-2xl font-bold">5</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-lg">
                            <div className="flex items-center">
                                <FaTrophy className="text-3xl text-blue-200" />
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold">Achievements</h3>
                                    <p className="text-2xl font-bold">12</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-lg">
                            <div className="flex items-center">
                                <FaShare className="text-3xl text-blue-200" />
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold">Shared Plans</h3>
                                    <p className="text-2xl font-bold">3</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-4 mb-8 border-b">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-6 py-3 font-medium text-sm rounded-t-lg transition-colors
                ${activeTab === tab.id
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                        >
                            <tab.icon className="mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {activeTab === 'progress' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Course Progress</h2>
                                <button
                                    onClick={() => navigate('/courses')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                >
                                    <FaGraduationCap className="mr-2" />
                                    Browse Courses
                                </button>
                            </div>
                            <CourseProgress />
                        </div>
                    )}

                    {activeTab === 'skills' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Skills Development</h2>

                            </div>
                            <SkillSection userId={userId} viewOnly={false} />
                        </div>
                    )}

                    {activeTab === 'certifications' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>

                            </div>
                            <CertificationSection userId={userId} />
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
};

export default LearningProgressPage;
