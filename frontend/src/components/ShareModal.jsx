import React, { useState, useEffect } from "react";

const ShareModal = ({ postId, fromUserId, onClose, onShared }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async (query) => {
        try {
            const res = await fetch(`http://localhost:8070/api/user/search?q=${query}`);
            const data = await res.json();
            setSearchResults(data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        }
    };

    useEffect(() => {
        if (searchQuery.length > 0) {
            fetchUsers(searchQuery);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const handleShare = async () => {
        if (!selectedUser) {
            alert("Please select a user to share with!");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8070/api/media/share`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postId,
                    fromUserId,
                    toUserId: selectedUser.id,
                }),
            });

            if (res.ok) {
                alert("Post shared successfully!");
                onShared(); // ✅ Refresh posts
                onClose();  // ✅ Close the modal
            } else {
                alert("Failed to share post.");
            }
        } catch (error) {
            console.error("Sharing failed:", error);
            alert("An error occurred while sharing.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-600 text-xl"
                >
                    ×
                </button>
                <h2 className="text-xl font-bold mb-4">Share Post</h2>

                {/* Search bar */}
                <input
                    type="text"
                    placeholder="Search user by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border p-2 w-full mb-4 rounded"
                />

                {/* Results */}
                <div className="max-h-40 overflow-y-auto space-y-2 mb-4">
                    {searchResults.map((user) => (
                        <div
                            key={user.id}
                            className={`p-2 border rounded cursor-pointer hover:bg-gray-100 ${
                                selectedUser?.id === user.id ? "bg-blue-100" : ""
                            }`}
                            onClick={() => setSelectedUser(user)}
                        >
                            {user.name}
                        </div>
                    ))}
                </div>

                {/* Confirm Share Button */}
                <button
                    onClick={handleShare}
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                >
                    Share Post
                </button>
            </div>
        </div>
    );
};

export default ShareModal;
