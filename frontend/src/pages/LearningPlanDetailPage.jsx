import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLearningPlanById, updateLearningPlan } from '../services/learningPlanService';

const LearningPlanDetailPage = () => {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [taskStatus, setTaskStatus] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlan = async () => {
      const data = await getLearningPlanById(planId);
      setPlan(data);

      // Initialize task status
      const initialStatus = {};
      data.tasks.forEach((task, idx) => {
        initialStatus[idx] = task.completed || false;
      });
      setTaskStatus(initialStatus);
    };

    fetchPlan();
  }, [planId]);

  const handleCheck = async (idx) => {
    const newStatus = !taskStatus[idx];

    // Update local state
    setTaskStatus(prev => ({
      ...prev,
      [idx]: newStatus
    }));

    // Create updated plan with new task status
    const updatedPlan = { ...plan };
    updatedPlan.tasks = plan.tasks.map((task, index) => {
      if (index === idx) {
        return { ...task, completed: newStatus };
      }
      return task;
    });

    // Update plan in backend
    try {
      await updateLearningPlan(planId, updatedPlan);
      setPlan(updatedPlan);
    } catch (error) {
      console.error("Failed to update task status:", error);
      // Revert local state if update fails
      setTaskStatus(prev => ({
        ...prev,
        [idx]: !newStatus
      }));
    }
  };

  const progress = plan?.tasks.length
      ? (Object.values(taskStatus).filter(Boolean).length / plan.tasks.length) * 100
      : 0;

  if (!plan) return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
  );

  return (
      <div className="mt-16 min-h-screen bg-gray-50">
        {/* Curved header with gradient background */}
        <div
            className="relative h-64 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
              borderBottomLeftRadius: '30% 15%',
              borderBottomRightRadius: '30% 15%'
            }}
        >
          {/* Back button */}
          <button
              onClick={() => navigate(-1)}
              className="absolute top-6 left-6 text-white p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Plan title and code */}
          <div className="px-8 pt-20">
            <div className="text-blue-100 font-medium mb-1">
              {plan.scope || "Learning Plan"}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{plan.title}</h1>

            {/* Time and instructor-like info */}
            <div className="flex items-center text-white text-opacity-90 mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{plan.startDate} - {plan.endDate}</span>
            </div>

            <div className="flex items-center text-white text-opacity-90 mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Created by {plan.userId ? 'You' : 'Unknown'}</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-3xl mx-auto px-4 mt-8">
          {/* Progress card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Progress</h3>
              <span className="text-blue-600 font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #2563eb, #60a5fa)'
                  }}
              />
            </div>
          </div>

          {/* Additional stats cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="text-sm text-gray-500 mb-1">Total Tasks</div>
              <div className="text-2xl font-bold text-gray-800">{plan.tasks.length}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="text-sm text-gray-500 mb-1">Completed</div>
              <div className="text-2xl font-bold text-blue-600">
                {Object.values(taskStatus).filter(Boolean).length}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="flex border-b">
              <button
                  className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                  className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'tasks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('tasks')}
              >
                Tasks
              </button>
            </div>

            {/* Tab content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Introduction</h3>
                      <p className="text-gray-600 leading-relaxed">{plan.background}</p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {plan.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {plan.topics.map((topic, index) => (
                            <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {topic}
                      </span>
                        ))}
                      </div>
                    </div>
                  </div>
              )}

              {activeTab === 'tasks' && (
                  <div>
                    <div className="space-y-4">
                      {plan.tasks.map((task, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-4 flex items-start gap-4">
                            <div className="mt-1">
                              <input
                                  type="checkbox"
                                  checked={taskStatus[idx] || false}
                                  onChange={() => handleCheck(idx)}
                                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <h4 className={`font-medium ${taskStatus[idx] ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                {task.taskName}
                              </h4>
                              <p className={`text-sm mt-1 ${taskStatus[idx] ? 'text-gray-400' : 'text-gray-600'}`}>
                                {task.taskDescription}
                              </p>
                            </div>
                          </div>
                      ))}
                    </div>

                    {plan.tasks.length === 0 && (
                        <div className="text-center py-8">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                          </svg>
                          <p className="text-gray-600">No tasks added to this learning plan yet.</p>
                          <button
                              onClick={() => navigate(`/learningplan/edit/${plan.id}`)}
                              className="mt-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition duration-300"
                          >
                            Add Tasks
                          </button>
                        </div>
                    )}
                  </div>
              )}
            </div>
          </div>

          {/* Related courses section */}
          {plan.relatedCourseIds && plan.relatedCourseIds.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Courses</h3>
                <div className="space-y-3">
                  {plan.relatedCourseIds.map((courseId, idx) => (
                      <div key={idx} className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-blue-700">Course ID: {courseId}</p>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}


        </div>
      </div>
  );
};

export default LearningPlanDetailPage;