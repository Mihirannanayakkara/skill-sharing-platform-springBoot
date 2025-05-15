import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMyLearningPlans } from '../services/learningPlanService';

const ShareLearningPlan = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [sharedPlans, setSharedPlans] = useState([]);

  useEffect(() => {
    const fetchAndSaveSharedPlan = async () => {
      if (!user?.id) return;
      const plans = await getMyLearningPlans(user.id);
      const selectedPlan = plans.find((p) => p.id === planId);

      if (selectedPlan) {
        const existingShared = JSON.parse(localStorage.getItem('sharedPlans')) || [];

        // Check if already shared to avoid duplicates
        const alreadyShared = existingShared.find(p => p.id === selectedPlan.id);
        if (!alreadyShared) {
          const updatedShared = [selectedPlan, ...existingShared];
          localStorage.setItem('sharedPlans', JSON.stringify(updatedShared));
          setSharedPlans(updatedShared);
        } else {
          setSharedPlans(existingShared);
        }
      }
    };

    fetchAndSaveSharedPlan();
  }, [planId, user?.id]);

  useEffect(() => {
    const existingShared = JSON.parse(localStorage.getItem('sharedPlans')) || [];
    setSharedPlans(existingShared);
  }, []);

  const handleDeleteSharedPlan = (planIdToDelete) => {
    const updatedSharedPlans = sharedPlans.filter(plan => plan.id !== planIdToDelete);
    localStorage.setItem('sharedPlans', JSON.stringify(updatedSharedPlans));
    setSharedPlans(updatedSharedPlans);
  };

  if (sharedPlans.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <p>No shared learning plans yet.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 underline mb-6"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Shared Learning Plans</h1>

      {sharedPlans.map((plan, idx) => (
        <div key={idx} className="bg-white p-6 rounded shadow mb-6 relative">
          <h2 className="text-2xl font-semibold mb-2">{plan.title}</h2>
          <p className="text-gray-700 mb-2">{plan.background}</p>
          <p className="text-gray-600 mb-4">{plan.scope}</p>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Skills:</h3>
            <ul className="list-disc pl-6">
              {plan.skills?.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Topics:</h3>
            <ul className="list-disc pl-6">
              {plan.topics?.map((topic, i) => (
                <li key={i}>{topic}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Tasks:</h3>
            <ul className="list-disc pl-6">
              {plan.tasks?.map((task, i) => (
                <li key={i}>
                  {task.taskName} {task.completed ? "(Completed)" : ""}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Timeline:</h3>
            <p>{plan.startDate} ➔ {plan.endDate}</p>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => handleDeleteSharedPlan(plan.id)}
            className="absolute top-4 right-4 bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default ShareLearningPlan;
