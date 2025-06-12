import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [user, setUser] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hoverButton, setHoverButton] = useState(false);
    const [bubbles, setBubbles] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        // Safely get user data from localStorage
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            setUser(userData || { name: "Guest", email: "guest@example.com", imageUrl: "/api/placeholder/100/100" });
        } catch (error) {
            console.error("Error parsing user data:", error);
            setUser({ name: "Guest", email: "guest@example.com", imageUrl: "/api/placeholder/100/100" });
        }

        // Animation sequence
        setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        // Generate initial bubbles
        generateBubbles();

        // Set interval to regenerate bubbles
        const bubbleInterval = setInterval(() => {
            generateBubbles();
        }, 3000);

        return () => clearInterval(bubbleInterval);
    }, []);

    // Generate random bubbles
    const generateBubbles = () => {
        const newBubbles = [];
        const colors = [
            'bg-blue-200', 'bg-indigo-200', 'bg-sky-200',
            'bg-cyan-200', 'bg-blue-300', 'bg-indigo-300',
            'bg-sky-300', 'bg-cyan-300'
        ];

        for (let i = 0; i < 8; i++) {
            newBubbles.push({
                id: Date.now() + i,
                size: Math.random() * 200 + 50,
                top: Math.random() * 100,
                left: Math.random() * 100,
                opacity: Math.random() * 0.4 + 0.1,
                color: colors[Math.floor(Math.random() * colors.length)],
                duration: Math.random() * 15 + 10,
                delay: Math.random() * 5
            });
        }

        setBubbles(prev => [...prev.slice(-16), ...newBubbles]);
    };

    // Animated background bubbles
    const BackgroundBubbles = () => {
        return (
            <div className="absolute inset-0 overflow-hidden z-0">
                {bubbles.map((bubble) => (
                    <div
                        key={bubble.id}
                        className={`absolute rounded-full ${bubble.color} blur-xl animate-bubble`}
                        style={{
                            width: `${bubble.size}px`,
                            height: `${bubble.size}px`,
                            top: `${bubble.top}%`,
                            left: `${bubble.left}%`,
                            opacity: bubble.opacity,
                            animation: `bubble ${bubble.duration}s ease-in-out ${bubble.delay}s`,
                        }}
                    />
                ))}
            </div>
        );
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-pulse p-6 rounded-lg bg-white shadow-lg">
                    <div className="w-48 h-6 bg-slate-200 rounded mb-4"></div>
                    <div className="w-32 h-32 bg-slate-200 rounded-full mx-auto mb-4"></div>
                    <div className="w-40 h-4 bg-slate-200 rounded mb-2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden relative">
            {/* CSS for custom animations */}
            <style>
                {`
        @keyframes bubble {
          0% { transform: scale(0); opacity: 0; }
          20% { transform: scale(1); opacity: ${Math.random() * 0.4 + 0.1}; }
          80% { transform: scale(1); opacity: ${Math.random() * 0.4 + 0.1}; }
          100% { transform: scale(0); opacity: 0; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(0px) translateX(10px); }
          75% { transform: translateY(10px) translateX(5px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        
        .profile-glow:hover {
          box-shadow: 0 0 25px rgba(16, 44, 185, 0.6);
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .button-hover:hover {
          box-shadow: 0 10px 25px -5px rgba(16, 44, 185, 0.6);
          transform: translateY(-2px);
        }
        `}
            </style>

            {/* Animated background elements */}
            <BackgroundBubbles />

            <div className="flex-1 flex flex-col items-center justify-center z-10">
                <div
                    className={`bg-white bg-opacity-60 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-md w-full transition-all duration-700 ease-out transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <div
                        className={`mb-6 text-center transition-all duration-500 transform ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                        style={{ transitionDelay: '200ms' }}
                    >
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                            Welcome, {user.name}
                        </h1>
                    </div>

                    <div
                        className={`flex flex-col items-center transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        style={{ transitionDelay: '400ms' }}
                    >
                        <div className="relative mb-6 group animate-float">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300 profile-glow"></div>
                            <div className="relative">
                                <img
                                    src={user.imageUrl}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white"
                                    onError={(e) => {
                                        e.target.src = "/api/placeholder/128/128";
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-center">
                            <p className="text-gray-800 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium">{user.email}</span>
                            </p>
                        </div>
                    </div>

                    <div
                        className={`mt-8 transition-all duration-500 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{ transitionDelay: '600ms' }}
                    >
                        <button
                            onClick={() => navigate('/post/viewall')}
                            onMouseEnter={() => setHoverButton(true)}
                            onMouseLeave={() => setHoverButton(false)}
                            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 button-hover"
                        >
                            <span>Discover Posts</span>
                            <svg
                                className={`w-5 h-5 transition-transform duration-300 ${hoverButton ? 'translate-x-1' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;