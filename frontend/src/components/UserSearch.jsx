import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`http://localhost:8070/api/user/search-v2?query=${searchTerm}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching users:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const viewProfile = (userId) => {
        navigate(`/user/${userId}`);
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <form onSubmit={handleSearch} className="mb-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search users by name or email..."
                        className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {isSearching ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            <div className="space-y-4">
                {searchResults.map(user => (
                    <div
                        key={user.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={user.imageUrl || 'https://via.placeholder.com/40'}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <h3 className="font-semibold">{user.name}</h3>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => viewProfile(user.id)}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                        >
                            View Profile
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserSearch;