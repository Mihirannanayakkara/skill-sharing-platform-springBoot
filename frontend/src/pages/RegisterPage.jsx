import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8070/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          role: 'user' // default role
        })
      });

      if (res.ok) {
        navigate('/');
      } else {
        const errorText = await res.text();
        alert(`Registration failed: ${errorText}`);
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Register</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
          <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full p-2 border"
              onChange={handleChange}
              required
          />
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
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Register</button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 underline hover:text-blue-800">
            Login here
          </Link>
        </p>
      </div>
  );
};

export default RegisterPage;
