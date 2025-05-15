import React from 'react';
import SkillSection from '../components/SkillSection';
import CertificationSection from '../components/CertificationSection';
import CourseProgress from '../components/CourseProgress';
import UserProfileHeader from '../components/UserProfileHeader';
import { useNavigate } from "react-router-dom";
import ShareLearningPlan from './ShareLearningPlan';

const LearningProgressPage = () => {


  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <UserProfileHeader />
      <h1 className="text-3xl font-bold mb-6 text-center">Learning Progress</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SkillSection />
        <CertificationSection />
        <div className="mt-8">
        <button
          onClick={() => navigate("/learningplan")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
        >
          Go to Learning Plan
        </button>
      </div>
      </div>
      <div className="mt-8">
        <CourseProgress />
      </div>
      <div className="mt-8">
        <ShareLearningPlan />
      </div>
    </div>
  );
};

export default LearningProgressPage;
