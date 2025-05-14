import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfileHeader = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const email = JSON.parse(localStorage.getItem("user"))?.email;
        const res = await fetch(`http://localhost:8070/api/user/email/${email}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) return null;

  return (
    <div className="bg-white p-4 rounded shadow flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <img
          src={user.imageUrl}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <button
        onClick={() => navigate('/edit-profile')}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Edit Details
      </button>
    </div>
  );
};

export default UserProfileHeader;
