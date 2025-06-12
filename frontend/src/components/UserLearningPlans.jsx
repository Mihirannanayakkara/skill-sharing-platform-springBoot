import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getMyLearningPlans } from '../services/learningPlanService';
import { useNavigate } from 'react-router-dom';
import LoadingSkeleton from './LoadingSkeleton';

const UserLearningPlans = () => {
    const [learningPlans, setLearningPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchLearningPlans = async () => {
            try {
                if (user?.id) {
                    const plans = await getMyLearningPlans(user.id);
                    // Sort plans by start date, most recent first
                    const sortedPlans = plans.sort((a, b) =>
                        new Date(b.startDate) - new Date(a.startDate)
                    );
                    setLearningPlans(sortedPlans);
                }
            } catch (error) {
                console.error('Error fetching learning plans:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLearningPlans();
    }, [user?.id]);

    const calculateProgress = (tasks) => {
        if (!tasks || tasks.length === 0) return 0;
        const completedTasks = tasks.filter(task => task.completed).length;
        return Math.round((completedTasks / tasks.length) * 100);
    };

    if (isLoading) {
        return <LoadingSkeleton type="card" count={3} />;
    }

    return (
        <motion.div
            className="bg-white rounded-lg shadow-sm p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">My Learning Plans</h2>
                <button
                    onClick={() => navigate('/learningplan')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    View All
                </button>
            </div>
            <div className="space-y-4">
                {learningPlans.length === 0 ? (
                    <div className="text-center py-6">
                        <p className="text-gray-600 mb-4">No learning plans yet</p>
                        <button
                            onClick={() => navigate('/learningplan')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                        >
                            Create Your First Plan
                        </button>
                    </div>
                ) : (
                    learningPlans.slice(0, 3).map((plan) => (
                        <div
                            key={plan.id}
                            className="border-l-4 border-blue-600 pl-4 cursor-pointer hover:bg-blue-50 p-3 rounded-r-md transition duration-300"
                            onClick={() => navigate(`/learningplan/view/${plan.id}`)}
                        >
                            <p className="font-medium text-gray-800">{plan.title}</p>
                            <div className="mt-2">
                                <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                                    <span>Progress</span>
                                    <span>{calculateProgress(plan.tasks)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${calculateProgress(plan.tasks)}%` }}
                                    ></div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                            </p>
                        </div>
                    ))
                )}
            </div>
            {learningPlans.length > 0 && (
                <button
                    onClick={() => navigate('/learningplan')}
                    className="mt-4 w-full bg-blue-50 text-blue-700 font-medium py-2 rounded-md hover:bg-blue-100 transition duration-300"
                >
                    View All Learning Plans
                </button>
            )}
        </motion.div>
    );
};

export default UserLearningPlans;