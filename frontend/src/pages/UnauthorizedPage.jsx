import React from 'react';

const UnauthorizedPage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
    </div>
);

export default UnauthorizedPage;
