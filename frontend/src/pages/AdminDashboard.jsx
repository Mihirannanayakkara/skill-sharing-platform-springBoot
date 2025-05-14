import React, { useState } from 'react';
import CreateCourse from '../components/CreateCourse';
import ViewStats from '../pages/ViewStats';


const AdminDashboard = () => {
  const [tab, setTab] = useState('stats');

  return (
    <div className="min-h-screen flex">
      {/* Left Navigation */}
      <div className="w-1/5 bg-gray-800 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <button onClick={() => setTab('create')} className="block w-full text-left">Create Course</button>
        <button onClick={() => setTab('stats')} className="block w-full text-left">View Stats</button>
        <button onClick={() => setTab('users')} className="block w-full text-left">Manage Courses</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50">
        {tab === 'create' && <CreateCourse />}
        {tab === 'stats' && <ViewStats />}
        {tab === 'users' && <div><h2 className="text-2xl">Manage Courses (Coming soon)</h2></div>}
      </div>
    </div>
  );
};

export default AdminDashboard;
