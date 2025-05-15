import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { createLearningPlan } from "../services/learningPlanService";

const AIGenerateTasksPage = () => {
  const [skills, setSkills] = useState([]);
  const [topics, setTopics] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [planData, setPlanData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Get plan data from localStorage if it was passed from CreateLearningPlanModal
  useEffect(() => {
    const storedPlanData = localStorage.getItem("tempPlanData");
    if (storedPlanData) {
      const parsedData = JSON.parse(storedPlanData);
      setPlanData(parsedData);
      setSkills(parsedData.skills || []);
      setTopics(parsedData.topics || []);
    }
  }, []);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

const handleGenerateTasks = async () => {
  setIsLoading(true);
  setError(null);

  // Validate input
  if (skills.length === 0 && topics.length === 0) {
    setError("Please add at least one skill or topic to generate tasks.");
    setIsLoading(false);
    return;
  }

  try {
    // Create a learning plan object structure that matches what the backend expects
    const learningPlanData = {
      title: "Temporary Plan",
      skills: skills,
      topics: topics,
      background: prompt || "Generated using AI",
      tasks: [],
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    console.log("Sending request to AI service:", learningPlanData);

    // Use the correct backend URL
    const response = await axios.post("http://localhost:8070/api/ailearningplans/generate-tasks", learningPlanData);
    
    console.log("Received response:", response.data);

    if (response.data && response.data.tasks) {
      setGeneratedTasks(response.data.tasks);
      if (response.data.tasks.length === 0) {
        setError("No tasks were generated. Try adding more specific skills or topics.");
      }
    } else {
      throw new Error("Invalid response format: " + JSON.stringify(response.data));
    }
  } catch (err) {
    console.error("Error generating tasks:", err);
    
    // More detailed error message
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response data:", err.response.data);
      console.error("Response status:", err.response.status);
      setError(`Server error (${err.response.status}): ${err.response.data?.message || "Failed to generate tasks"}`);
    } else if (err.request) {
      // The request was made but no response was received
      console.error("No response received:", err.request);
      setError("No response from server. Please check your network connection.");
    } else {
      // Something happened in setting up the request that triggered an Error
      setError(`Error: ${err.message}`);
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleTaskSelection = (task) => {
    const isSelected = selectedTasks.some((t) => t.taskName === task.taskName);

    if (isSelected) {
      setSelectedTasks(
        selectedTasks.filter((t) => t.taskName !== task.taskName)
      );
    } else {
      setSelectedTasks([...selectedTasks, task]);
    }
  };

 const handleAddToLearningPlan = async () => {
  if (selectedTasks.length === 0) {
    return;
  }

  try {
    setIsLoading(true);
    
    // Get the current user
    const user = JSON.parse(localStorage.getItem("user"));
    
    // Create a new learning plan with the selected tasks
    const newPlan = {
      title: planData?.title || "AI Generated Learning Plan",
      background: prompt || "Generated using AI assistant",
      scope: planData?.scope || "AI Generated Tasks",
      skills: skills,
      topics: topics,
      tasks: selectedTasks,
      userId: user.id,
      startDate: planData?.startDate || new Date().toISOString().split('T')[0],
      endDate: planData?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      relatedCourseIds: planData?.relatedCourseIds || []
    };
    
    console.log("Creating learning plan:", newPlan);
    
    // Call the API to create the learning plan
    await createLearningPlan(newPlan);
    
    // Clear temporary plan data from localStorage
    localStorage.removeItem("tempPlanData");
    
    // Show success message
    alert("Learning plan created successfully!");
    
    // Navigate to the learning plan page
    navigate("/learningplan");
  } catch (error) {
    console.error("Error creating learning plan:", error);
    setError("Failed to create learning plan. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      setSkills([...skills, e.target.value.trim()]);
      e.target.value = "";
    }
  };

  const handleAddTopic = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      setTopics([...topics, e.target.value.trim()]);
      e.target.value = "";
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleRemoveTopic = (topicToRemove) => {
    setTopics(topics.filter((topic) => topic !== topicToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">AI Task Generator</h1>
            <p className="text-purple-100">
              Create personalized learning tasks using AI
            </p>
          </div>

          <div className="p-6">
            {/* Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Skills Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add a skill and press Enter"
                  className="w-full p-2 border border-gray-300 rounded"
                  onKeyPress={handleAddSkill}
                />
              </div>

              {/* Topics Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Topics
                </h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  {topics.map((topic, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                    >
                      <span>{topic}</span>
                      <button
                        onClick={() => handleRemoveTopic(topic)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add a topic and press Enter"
                  className="w-full p-2 border border-gray-300 rounded"
                  onKeyPress={handleAddTopic}
                />
              </div>
            </div>

            {/* Additional Prompt */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Additional Instructions (Optional)
              </h2>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="Add any specific requirements or focus areas for your learning tasks..."
                value={prompt}
                onChange={handlePromptChange}
              ></textarea>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center mb-8">
              <button
                onClick={handleGenerateTasks}
                disabled={isLoading}
                className={`px-6 py-3 rounded-lg font-medium flex items-center ${
                  isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Generate Tasks
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p>{error}</p>
              </div>
            )}

            {/* Generated Tasks */}
            {generatedTasks.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Generated Tasks
                  </h2>
                  <p className="text-sm text-gray-600">
                    Select the tasks you want to add to your learning plan
                  </p>
                </div>

                <div className="divide-y divide-gray-200">
                  {generatedTasks.map((task, index) => (
                    <div
                      key={index}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        selectedTasks.some((t) => t.taskName === task.taskName)
                          ? "bg-blue-50"
                          : ""
                      }`}
                      onClick={() => handleTaskSelection(task)}
                    >
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 text-blue-600 rounded"
                          checked={selectedTasks.some(
                            (t) => t.taskName === task.taskName
                          )}
                          onChange={() => {}}
                        />
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-800">
                            {task.taskName}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {task.taskDescription}
                          </p>

                          {task.objective && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-gray-500">
                                Objective:
                              </span>
                              <p className="text-sm text-gray-700">
                                {task.objective}
                              </p>
                            </div>
                          )}

                          {task.estimatedTime && (
                            <div className="mt-1">
                              <span className="text-xs font-medium text-gray-500">
                                Estimated time:
                              </span>
                              <span className="text-sm text-gray-700 ml-1">
                                {task.estimatedTime}
                              </span>
                            </div>
                          )}

                          {task.suggestedResources &&
                            task.suggestedResources.length > 0 && (
                              <div className="mt-2">
                                <span className="text-xs font-medium text-gray-500">
                                  Resources:
                                </span>
                                <ul className="list-disc list-inside text-sm text-gray-700 ml-1">
                                  {task.suggestedResources.map(
                                    (resource, idx) => (
                                      <li key={idx}>{resource}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => navigate("/learningplan")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleAddToLearningPlan}
                disabled={selectedTasks.length === 0}
                className={`px-4 py-2 rounded-lg ${
                  selectedTasks.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                Add {selectedTasks.length}{" "}
                {selectedTasks.length === 1 ? "Task" : "Tasks"} to Learning Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGenerateTasksPage;
