import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
            const { token, userId, email: userEmail, firstName, lastName } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('email', userEmail);
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);

            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed', error.response ? error.response.data : error.message);
            alert('Login failed. Please check your credentials.');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/google-login', {
                token: credentialResponse.credential
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('firstName', response.data.firstName);
            localStorage.setItem('lastName', response.data.lastName);
            localStorage.setItem('email', response.data.email);
            navigate('/dashboard');
        } catch (error) {
            console.error('Google login failed', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="w-1/2 p-12 text-white">
                <h1 className="text-3xl font-bold mb-8">Sitemark</h1>
                <div className="space-y-8">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-500 p-2 rounded-full">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Adaptable performance</h2>
                            <p className="text-gray-400">Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-green-500 p-2 rounded-full">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Built to last</h2>
                            <p className="text-gray-400">Experience unmatched durability that goes above and beyond with lasting investment.</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-yellow-500 p-2 rounded-full">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Great user experience</h2>
                            <p className="text-gray-400">Integrate our product into your routine with an intuitive and easy-to-use interface.</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-red-500 p-2 rounded-full">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Innovative functionality</h2>
                            <p className="text-gray-400">Stay ahead with features that set new standards, addressing your evolving needs better than the rest.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-1/2 p-12 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg">
                <div className="max-w-md mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-6">Sign in</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <input id="remember_me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-400">Remember me</label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-500 hover:text-blue-400">Forgot your password?</a>
                            </div>
                        </div>
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Sign in
                        </button>
                    </form>
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <GoogleLogin
                                clientId="758786818529-i8p4io7tc3ebbft1hd50tot2tl891hqn.apps.googleusercontent.com"
                                onSuccess={handleGoogleSuccess}
                                onError={() => console.log('Google Login Failed')}
                                render={renderProps => (
                                    <button
                                        onClick={renderProps.onClick}
                                        disabled={renderProps.disabled}
                                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-200 hover:bg-gray-600"
                                    >
                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                                        </svg>
                                        Sign in with Google
                                    </button>
                                )}
                            />
                            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-200 hover:bg-gray-600">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                    <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                                </svg>
                                Sign in with Facebook
                            </button>
                        </div>
                    </div>
                    <p className="mt-10 text-center text-sm text-gray-400">
                        Don't have an account?
                        <Link to="/register" className="font-medium text-blue-500 hover:text-blue-400 ml-1">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;