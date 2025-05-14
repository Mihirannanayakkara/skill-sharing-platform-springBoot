import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-4xl font-bold mb-4">Welcome, {user?.name}</h1>
      <img src={user?.imageUrl} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
      <p className="text-lg text-gray-700">Email: {user?.email}</p>

      {/* New Button */}
      <button
        onClick={() => navigate('/learning-progress')}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
      >
        Go to Learning Progress
      </button>
    </div>
  );
};

export default HomePage;
