import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleJWTLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8070/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const token = await res.text();
      localStorage.setItem('token', token);

      // Fetch user info using email
      const userRes = await fetch(`http://localhost:8070/api/user/email/${form.email}`);
      const userData = await userRes.json();
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', userData.role);

      // Redirect based on role
      navigate(userData.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      console.error('JWT Login failed:', err);
    }
  };

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const userDTO = {
        name: decoded.name,
        email: decoded.email,
        imageUrl: decoded.picture
      };

      await axios.post('http://localhost:8070/api/user/google-auth', userDTO, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      // Get full user (with role) by email
      const userRes = await axios.get(`http://localhost:8070/api/user/email/${userDTO.email}`);
      const userData = userRes.data;

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', userData.role);

      // Redirect based on role
      navigate(userData.role === 'admin' ? '/admin' : '/home');
    } catch (error) {
      console.error('Google Login failed:', error);
    }
  };

  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 space-y-10">
        <h1 className="text-3xl font-bold">Login</h1>

        {/* JWT Form Login */}
        <form onSubmit={handleJWTLogin} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
          <h2 className="text-xl font-semibold text-center">Login with Email</h2>
          <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 border"
              onChange={handleChange}
              required
          />
          <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 border"
              onChange={handleChange}
              required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
        </form>

        {/* Google OAuth Login */}
        <div className="bg-white p-6 rounded shadow-md w-80 text-center space-y-2">
          <h2 className="text-xl font-semibold">Or Login with Google</h2>
          <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.error("Google Login Failed")}
              useOneTap
          />
          <p className="text-sm mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 underline hover:text-blue-800">
              Register here
            </Link>
          </p>
        </div>
      </div>
  );
};

export default LoginPage;
