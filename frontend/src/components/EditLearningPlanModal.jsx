import React, { useState } from "react";
import { updateLearningPlan } from "../services/learningPlanService";

const EditLearningPlanModal = ({ plan, onClose, onUpdated }) => {
  const [form, setForm] = useState({ ...plan });
  const [newSkill, setNewSkill] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newTask, setNewTask] = useState({ taskName: "", taskDescription: "" });
  const [activeTab, setActiveTab] = useState("basic");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  const handleAddSkill = () => {
    if (newSkill.trim() !== "") {
      setForm((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleAddTopic = () => {
    if (newTopic.trim() !== "") {
      setForm((prev) => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()],
      }));
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      topics: prev.topics.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleAddTask = () => {
    if (newTask.taskName.trim() !== "") {
      setForm((prev) => ({
        ...prev,
        tasks: [...prev.tasks, { ...newTask, completed: false }],
      }));
      setNewTask({ taskName: "", taskDescription: "" });
    }
  };

  const handleUpdateTask = (index, field, value) => {
    const updatedTasks = [...form.tasks];
    updatedTasks[index][field] = value;
    setForm((prev) => ({ ...prev, tasks: updatedTasks }));
  };

  const handleToggleTaskCompletion = (index) => {
    const updatedTasks = [...form.tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setForm((prev) => ({ ...prev, tasks: updatedTasks }));
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = form.tasks.filter((_, idx) => idx !== index);
    setForm((prev) => ({ ...prev, tasks: updatedTasks }));
  };

  const handleSubmit = async () => {
    try {
      await updateLearningPlan(form.id, form);

      setSnackbarType("success");
      setSnackbarMessage(`"${form.title}" has been updated successfully`);
      setShowSnackbar(true);

      setTimeout(() => {
        setShowSnackbar(false);
        onUpdated();
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Failed to update learning plan:", error);

      setSnackbarType("error");
      setSnackbarMessage("Failed to update learning plan. Please try again.");
      setShowSnackbar(true);

      setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-auto z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Edit Learning Plan</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "basic"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Info
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "skills"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("skills")}
          >
            Skills & Topics
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "tasks"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            Tasks
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "timeline"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("timeline")}
          >
            Timeline
          </button>
        </div>

        {/* Content area */}
        <div className="p-6 overflow-y-auto flex-grow">
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Learning Plan Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background
                </label>
                <textarea
                  className="border border-gray-300 w-full p-2 rounded-md h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Describe the background and purpose of this learning plan"
                  value={form.background}
                  onChange={(e) =>
                    setForm({ ...form, background: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scope
                </label>
                <input
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Define the scope of this learning plan"
                  value={form.scope}
                  onChange={(e) => setForm({ ...form, scope: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Skills & Topics Tab */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              {/* Skills Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Skills
                </h3>
                <div className="flex gap-2 mb-3">
                  <input
                    className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Add a new skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                  />
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                    onClick={handleAddSkill}
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(idx)}
                        className="text-blue-700 hover:text-blue-900 focus:outline-none"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Topics
                </h3>
                <div className="flex gap-2 mb-3">
                  <input
                    className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Add a new topic"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddTopic()}
                  />
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                    onClick={handleAddTopic}
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {form.topics.map((topic, idx) => (
                    <div
                      key={idx}
                      className="bg-green-50 text-green-700 px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <span>{topic}</span>
                      <button
                        onClick={() => handleRemoveTopic(idx)}
                        className="text-green-700 hover:text-green-900 focus:outline-none"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Tasks</h3>

              {/* Task List */}
              <div className="space-y-3 mb-6">
                {form.tasks.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No tasks added yet. Add your first task below.
                  </p>
                ) : (
                  form.tasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow transition"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed || false}
                          onChange={() => handleToggleTaskCompletion(idx)}
                          className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="flex-grow">
                          <input
                            className={`border-b border-transparent hover:border-gray-300 w-full p-1 font-medium focus:border-blue-500 focus:outline-none ${
                              task.completed
                                ? "line-through text-gray-500"
                                : "text-gray-800"
                            }`}
                            value={task.taskName}
                            onChange={(e) =>
                              handleUpdateTask(idx, "taskName", e.target.value)
                            }
                            placeholder="Task Name"
                          />
                          <textarea
                            className="border-b border-transparent hover:border-gray-300 w-full p-1 text-sm text-gray-600 focus:border-blue-500 focus:outline-none mt-1"
                            value={task.taskDescription || ""}
                            onChange={(e) =>
                              handleUpdateTask(
                                idx,
                                "taskDescription",
                                e.target.value
                              )
                            }
                            placeholder="Task Description (optional)"
                            rows={2}
                          />
                        </div>
                        <button
                          onClick={() => handleDeleteTask(idx)}
                          className="text-gray-400 hover:text-red-600 focus:outline-none"
                          title="Delete task"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
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
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Task */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Add New Task
                </h4>
                <div className="space-y-3">
                  <input
                    className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Task Name"
                    value={newTask.taskName}
                    onChange={(e) =>
                      setNewTask({ ...newTask, taskName: e.target.value })
                    }
                  />
                  <textarea
                    className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Task Description (optional)"
                    value={newTask.taskDescription}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        taskDescription: e.target.value,
                      })
                    }
                    rows={2}
                  />
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition w-full"
                    onClick={handleAddTask}
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <div className="text-sm text-gray-500">
            {activeTab === "basic"
              ? "1/4"
              : activeTab === "skills"
              ? "2/4"
              : activeTab === "tasks"
              ? "3/4"
              : "4/4"}
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition flex items-center gap-2"
              onClick={handleSubmit}
            >
              <span>Save Changes</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            </button>
          </div>
        </div>
      </div>

      {showSnackbar && (
        <div
          className={`fixed bottom-4 left-4 px-6 py-3 rounded-md shadow-lg flex items-center gap-2 z-50 ${
            snackbarType === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {snackbarType === "success" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span>{snackbarMessage}</span>
        </div>
      )}
    </div>
  );
};

export default EditLearningPlanModal;
