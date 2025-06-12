import React, { useState, useEffect } from "react";
import AddManualTaskModal from "./AddManualTaskModal";
import { createLearningPlan } from "../services/learningPlanService";
import { getAllCourses } from "../services/dsrcourseService";

const CreateLearningPlanModal = ({ onClose, onCreated }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    background: "",
    scope: "",
    skills: [],
    relatedCourseIds: [],
    topics: [],
    tasks: [],
    startDate: "",
    endDate: "",
  });

  const [allCourses, setAllCourses] = useState([]);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const isStep1Valid =
      form.title.trim() !== "" &&
      form.background.trim() !== "" &&
      form.scope.trim() !== "";
  const isStep2Valid = form.skills.length > 0;

  useEffect(() => {
    const fetchCourses = async () => {
      const courses = await getAllCourses();
      setAllCourses(courses);
    };
    fetchCourses();
  }, []);

  const handleCreatePlan = async () => {
    try {
      const finalPlan = { ...form, userId: user.id };
      await createLearningPlan(finalPlan);
      setShowSnackbar(true);

      setTimeout(() => {
        setShowSnackbar(false);
        onCreated();
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error creating plan:", error);
      alert("Failed to create plan. Please try again.");
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() === "") return;
    const updatedSkills = [...form.skills, skillInput.trim()];
    setForm((prev) => ({ ...prev, skills: updatedSkills }));
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = form.skills.filter(
        (skill) => skill !== skillToRemove
    );
    setForm((prev) => ({ ...prev, skills: updatedSkills }));
  };

  const handleAddTopic = () => {
    if (topicInput.trim() === "") return;
    setForm((prev) => ({
      ...prev,
      topics: [...prev.topics, topicInput.trim()],
    }));
    setTopicInput("");
  };

  const handleAddTask = (task) => {
    setForm((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
    setShowAddTaskModal(false);
  };

  return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-auto z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl mx-4 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create Learning Plan</h2>
              <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex justify-between mb-8 relative">
              <div className="absolute top-1/2 h-0.5 bg-gray-300 w-full -z-10"></div>
              {[1, 2, 3, 4].map((stepNum) => (
                  <div
                      key={stepNum}
                      className={`flex flex-col items-center z-10 ${step === stepNum ? 'scale-110' : ''}`}
                  >
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                    ${step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                    >
                      {stepNum}
                    </div>
                    <span className={`text-xs ${step === stepNum ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                  {stepNum === 1 ? 'Basics' :
                      stepNum === 2 ? 'Skills & Topics' :
                          stepNum === 3 ? 'Timeline' : 'Tasks'}
                </span>
                  </div>
              ))}
            </div>

            <div className="mb-8">

              {/* Step 1 */}
              {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                          className="border w-full p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="Enter a descriptive title for your learning plan"
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                      />
                      {form.title.trim() === "" && (
                          <span className="text-xs text-red-500 mt-1"></span>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Background <span className="text-red-500">*</span>
                      </label>
                      <textarea
                          className="border w-full p-3 rounded-md h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="Describe the background and purpose of this learning plan"
                          value={form.background}
                          onChange={(e) =>
                              setForm({ ...form, background: e.target.value })
                          }
                      />
                      {form.background.trim() === "" && (
                          <span className="text-xs text-red-500 mt-1"></span>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Scope <span className="text-red-500">*</span>
                      </label>
                      <input
                          className="border w-full p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="Define the scope of your learning plan"
                          value={form.scope}
                          onChange={(e) => setForm({ ...form, scope: e.target.value })}
                      />
                      {form.scope.trim() === "" && (
                          <span className="text-xs text-red-500 mt-1"></span>
                      )}
                    </div>
                  </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                  <>
                    <h3 className="font-medium text-gray-700 mb-2">Skills</h3>
                    <div className="flex gap-2 mb-2">
                      <input
                          className="border p-2 w-full rounded"
                          placeholder="Add Skill *"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                      />
                      <button
                          className="bg-blue-600 text-white px-4 py-1 rounded"
                          onClick={handleAddSkill}
                      >
                        +
                      </button>
                    </div>

                    {form.skills.length === 0 && (
                        <div className="text-xs text-red-500 mb-2">At least one skill is required</div>
                    )}

                    <ul className="mb-4">
                      {form.skills.map((skill, idx) => (
                          <li
                              key={idx}
                              className="text-sm text-gray-700 flex items-center justify-between mb-1"
                          >
                            {skill}
                            <button
                                onClick={() => handleRemoveSkill(skill)}
                                className="text-red-600 ml-2 text-xs"
                            >
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                              >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </li>
                      ))}
                    </ul>

                    <h3 className="font-medium text-gray-700 mb-2">Topics</h3>
                    <div className="flex gap-2 mb-2">
                      <input
                          className="border p-2 w-full rounded"
                          placeholder="Add Topic"
                          value={topicInput}
                          onChange={(e) => setTopicInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddTopic()}
                      />
                      <button
                          className="bg-blue-600 text-white px-4 py-1 rounded"
                          onClick={handleAddTopic}
                      >
                        +
                      </button>
                    </div>
                    <ul className="mb-4">
                      {form.topics.map((topic, idx) => (
                          <li
                              key={idx}
                              className="text-sm text-gray-700 flex items-center justify-between mb-1"
                          >
                            {topic}
                            <button
                                onClick={() => {
                                  const updatedTopics = form.topics.filter(
                                      (_, i) => i !== idx
                                  );
                                  setForm((prev) => ({ ...prev, topics: updatedTopics }));
                                }}
                                className="text-red-600 ml-2 text-xs"
                            >
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                              >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </li>
                      ))}
                    </ul>
                  </>
              )}

              {/* Step 3 */}
              {step === 3 && (
                  <>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                          className="border w-full p-2 mb-2 rounded"
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          value={form.startDate}
                          onChange={(e) => {
                            const selectedDate = new Date(e.target.value);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0); // Reset time to beginning of day

                            if (selectedDate >= today) {
                              setForm({ ...form, startDate: e.target.value });
                            } else {
                              alert("Please select today or a future date");
                              setForm({
                                ...form,
                                startDate: new Date().toISOString().split("T")[0],
                              });
                            }
                          }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                          className="border w-full p-2 mb-2 rounded"
                          type="date"
                          min={form.startDate || new Date().toISOString().split("T")[0]}
                          value={form.endDate}
                          onChange={(e) => {
                            const selectedEndDate = new Date(e.target.value);
                            const startDate = form.startDate
                                ? new Date(form.startDate)
                                : new Date();
                            startDate.setHours(0, 0, 0, 0);

                            if (selectedEndDate >= startDate) {
                              setForm({ ...form, endDate: e.target.value });
                            } else {
                              alert("End date must be on or after the start date");
                              setForm({ ...form, endDate: form.startDate });
                            }
                          }}
                      />
                    </div>
                  </>
              )}

              {/* Step 4 */}
              {step === 4 && (
                  <>
                    <div>
                      <button
                          className="bg-green-600 text-white px-4 py-2 rounded mb-2"
                          onClick={() => setShowAddTaskModal(true)}
                      >
                        + Add Manual Task
                      </button>
                      <button
                          onClick={() => (window.location.href = "/aigenerate-tasks")}
                          className="bg-purple-600 text-white ml-6 px-4 py-2 rounded hover:bg-purple-700"
                      >
                        + Create AI Based Tasks
                      </button>
                    </div>
                    <ul>
                      {form.tasks.map((task, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {task.taskName}
                          </li>
                      ))}
                    </ul>
                  </>
              )}

              {/* Step Navigation */}
              <div className="flex justify-between mt-4">
                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="bg-gray-400 text-white px-4 py-1 rounded"
                    >
                      Back
                    </button>
                )}
                {step === 1 ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        className={`px-4 py-1 rounded ${
                            isStep1Valid
                                ? "bg-blue-600 text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!isStep1Valid}
                    >
                      Next
                    </button>
                ) : step === 2 ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        className={`px-4 py-1 rounded ${
                            isStep2Valid
                                ? "bg-blue-600 text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!isStep2Valid}
                    >
                      Next
                    </button>
                ) : (
                    step < 4 && (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="bg-blue-600 text-white px-4 py-1 rounded"
                        >
                          Next
                        </button>
                    )
                )}
                {step === 4 && (
                    <button
                        onClick={handleCreatePlan}
                        className="bg-green-600 text-white px-4 py-1 rounded"
                    >
                      Create Plan
                    </button>
                )}
              </div>
            </div>
          </div>

          {/* Success Snackbar */}
          {showSnackbar && (
              <div className="fixed bottom-4 left-4 bg-green-600 text-white px-6 py-3 rounded shadow-lg flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                  />
                </svg>
                Learning Plan successfully created!
              </div>
          )}

          {showAddTaskModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]">
                <AddManualTaskModal
                    onSave={handleAddTask}
                    onCancel={() => setShowAddTaskModal(false)}
                />
              </div>
          )}
        </div>
      </>
  );
};

export default CreateLearningPlanModal;