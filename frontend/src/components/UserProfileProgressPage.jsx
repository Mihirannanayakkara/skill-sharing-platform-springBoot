import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Award, Plus } from "lucide-react";

const UserProfilePage = () => {
  const userId = "680c843384e1b45abee0f37b";
  const [skills, setSkills] = useState([]);
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSkills = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/v1/skills/${userId}`
      );
      setSkills(response.data || []);
    } catch (err) {
      console.error("Error fetching user skills:", err);
      setError("Failed to load user skills.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProgressUpdates = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/v1/progress-updates/user/${userId}`
      );
      const data = response.data;
      const validData = data?.filter((item) => item && item.id);
      setProgressUpdates(validData || []);
    } catch (err) {
      console.error("Error fetching progress updates:", err);
      setError("Failed to load progress updates.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchProgressUpdates();
  }, []);

  const handleDeleteSkill = async (skillId) => {
    try {
      await axios.delete(
        `http://localhost:8081/api/v1/skills/${userId}/${skillId}`
      );
      fetchSkills(); // refresh list after removal
    } catch (err) {
      console.error("Failed to remove skill from user:", err);
      setError("Failed to remove skill from user.");
    }
  };

  const handleEdit = (progressId) => {
    navigate(`/editProgressUpdate/${progressId}`);
  };

  const handleDelete = async (progressId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this progress update?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:8081/api/v1/progress-updates/${progressId}`
      );

      // Remove with animation
      const elementToRemove = document.getElementById(`progress-${progressId}`);
      if (elementToRemove) {
        elementToRemove.classList.add("scale-0", "opacity-0");
        setTimeout(() => {
          setProgressUpdates((prevUpdates) =>
            prevUpdates.filter((update) => update.id !== progressId)
          );
        }, 300);
      } else {
        // Fallback if element not found
        setProgressUpdates((prevUpdates) =>
          prevUpdates.filter((update) => update.id !== progressId)
        );
      }
    } catch (err) {
      console.error("Error deleting progress update:", err);
      alert("Failed to delete progress update. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="p-6 bg-white rounded-lg shadow-lg border-l-4 border-red-500 animate-pulse">
          <h2 className="text-xl font-bold text-red-700">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-800 mb-8 text-center animate-fade-in">
          User ProgressUpdates and Skills
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skills Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <Award className="text-indigo-500 mr-2" size={24} />
                User Skills
              </h2>
              <button
                onClick={() => navigate("/createSkills")}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105"
              >
                <Plus size={18} className="mr-1" />
                Add Skill
              </button>
            </div>

            {skills.length === 0 ? (
              <p className="text-gray-500 italic text-center py-8">
                No skills found for this user.
              </p>
            ) : (
              <ul className="space-y-2">
                {skills.map((skill, index) => (
                  <li
                    key={skill?.id || index}
                    className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg transform transition-all duration-300 hover:translate-x-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="font-medium text-gray-700">
                      {skill?.name || "Unnamed Skill"}
                    </span>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Progress Updates Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Progress Updates
              </h2>
              <button
                onClick={() => navigate("/createProgressUpdate")}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 transform hover:scale-105"
              >
                <Plus size={18} className="mr-1" />
                Add Progress
              </button>
            </div>

            {progressUpdates.length === 0 ? (
              <p className="text-gray-500 italic text-center py-8">
                No progress updates available.
              </p>
            ) : (
              <div className="space-y-6">
                {progressUpdates.map((item, index) => (
                  <div
                    id={`progress-${item.id}`}
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-md p-5 transition-all duration-300 transform hover:shadow-lg hover:border-indigo-300 opacity-100 scale-100"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                      <h3 className="text-xl font-semibold text-indigo-700">
                        {item?.name || "No Name Provided"}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          className="p-2 rounded-full hover:bg-gray-200 transition-colors text-blue-600"
                          onClick={() => handleEdit(item.id)}
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          className="p-2 rounded-full hover:bg-gray-200 transition-colors text-red-600"
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-gray-700">
                      <p className="flex items-center">
                        <span className="font-medium w-32">Issued By:</span>
                        <span>{item?.issuingOrganization || "N/A"}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="font-medium w-32">Issue Date:</span>
                        <span>
                          {item?.issueDate?.month}/{item?.issueDate?.year}
                        </span>
                      </p>
                      {item?.expireDate?.year !== 0 && (
                        <p className="flex items-center">
                          <span className="font-medium w-32">Expire Date:</span>
                          <span>
                            {item?.expireDate?.month}/{item?.expireDate?.year}
                          </span>
                        </p>
                      )}
                      <p className="flex items-center">
                        <span className="font-medium w-32">Credential ID:</span>
                        <span>{item?.credentialId || "N/A"}</span>
                      </p>
                    </div>

                    <div className="mt-4">
                      <a
                        href={item?.credentialUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-blue-600 hover:text-blue-800 transition-colors hover:underline"
                      >
                        View Certificate
                      </a>
                    </div>

                    {item?.mediaUrl && (
                      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                        <img
                          src={item?.mediaUrl}
                          alt={`${item?.name} Certificate`}
                          className="w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}

                    {Array.isArray(item.skills) && item.skills.length > 0 && (
                      <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                        <div className="font-medium text-indigo-800 mb-2">
                          Skills:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.skills.map((skill, index) => (
                            <span
                              key={skill?.id || index}
                              className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                            >
                              {skill?.name || "Unnamed Skill"}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        li,
        .progress-card {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default UserProfilePage;
