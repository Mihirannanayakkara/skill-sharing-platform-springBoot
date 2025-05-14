// src/pages/PostListPage.jsx
import React, { useEffect, useState } from 'react';

const PostListPage = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const res = await fetch('http://localhost:8070/api/media/getAll');
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">All Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map(post => (
                    <div key={post.id} className="border p-4 rounded bg-white shadow">
                        <p className="mb-2">{post.description}</p>
                        {post.mediaType === 'IMAGE' && post.imageUrls?.map((url, idx) => (
                            <img key={idx} src={url} alt="Post" className="w-full rounded" />
                        ))}
                        {post.mediaType === 'VIDEO' && post.videoUrl && (
                            <video src={post.videoUrl} controls className="w-full rounded"></video>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostListPage;
