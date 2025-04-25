import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

const App = () => {
    return (
        <GoogleOAuthProvider clientId="758786818529-i8p4io7tc3ebbft1hd50tot2tl891hqn.apps.googleusercontent.com">
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<Login />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;