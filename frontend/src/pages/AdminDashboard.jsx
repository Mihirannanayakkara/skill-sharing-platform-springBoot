import React, { useState } from 'react';
import CreateCourse from '../components/CreateCourse';
import ViewStats from '../pages/ViewStats';

const AdminDashboard = () => {
  const [tab, setTab] = useState('stats');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left Navigation - Mobile Toggle */}
      <div className="md:hidden bg-white shadow p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          <button 
            className="block md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={() => document.getElementById('sidebar').classList.toggle('hidden')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Left Navigation */}
      <div id="sidebar" className="hidden md:block md:w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-1">Admin Panel</h2>
          <p className="text-blue-200 text-sm mb-6">Course Management System</p>
        </div>
        <nav className="px-4 pb-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setTab('stats')} 
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${tab === 'stats' ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Stats
              </button>
            </li>
            <li>
              <button 
                onClick={() => setTab('create')} 
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${tab === 'create' ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Course
              </button>
            </li>
            <li>
              <button 
                onClick={() => setTab('users')} 
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${tab === 'users' ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Manage Courses
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6">
            {/* Tab heading */}
            <div className="mb-6 border-b pb-4">
              <h1 className="text-2xl font-bold text-gray-800">
                {tab === 'stats' && 'Dashboard Statistics'}
                {tab === 'create' && 'Create New Course'}
                {tab === 'users' && 'Manage Courses'}
              </h1>
              <p className="text-gray-500 mt-1">
                {tab === 'stats' && 'View performance metrics and analytics'}
                {tab === 'create' && 'Add a new course to the system'}
                {tab === 'users' && 'Review and modify existing courses'}
              </p>
            </div>
            
            {/* Tab content */}
            <div className="min-h-96">
              {tab === 'create' && <CreateCourse />}
              {tab === 'stats' && <ViewStats />}
              {tab === 'users' && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-700">Manage Courses</h2>
                  <p className="text-gray-500 mt-2">This feature is coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;