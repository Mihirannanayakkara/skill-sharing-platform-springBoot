import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Award, ArrowLeft, Check, Plus } from "lucide-react";

const CreateSkills = () => {
  const [skillName, setSkillName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const userId = "680c843384e1b45abee0f37b"; // Replace with actual user ID if dynamic

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const skill = {
      skillName: skillName,
    };

    try {
      await axios.post(`http://localhost:8081/api/v1/skills/${userId}`, skill);
      setMessage("Skill added successfully!");
      setShowSuccess(true);
      setSkillName("");

      setTimeout(() => {
        navigate("/profileProgress");
      }, 1500);
    } catch (error) {
      console.error("Error adding skill:", error);
      setMessage("Failed to add skill.");
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-2xl transform transition-all duration-500 scale-100 opacity-100 animate-bounce">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600">Your skill has been added.</p>
            <p className="text-gray-500 text-sm mt-2">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate("/profileProgress")}
          className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to Profile</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl animate-fadeIn">
          <div className="bg-indigo-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Award className="mr-2" size={24} />
              Add New Skill
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Skill Name
              </label>
              <input
                type="text"
                name="skillName"
                placeholder="Enter skill name (e.g. JavaScript, Project Management)"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg"
              />
            </div>

            {message && !showSuccess && (
              <div
                className={`p-3 rounded-lg ${
                  message.includes("Failed")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {message}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow flex items-center transition-all duration-300 ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-indigo-700 transform hover:scale-105"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Adding...
                  </div>
                ) : (
                  <>
                    <Plus size={18} className="mr-2" />
                    Add Skill
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Global CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CreateSkills;
