import React, { useEffect, useState } from "react";
import {
  getMyLearningPlans,
  deleteLearningPlan,
} from "../services/learningPlanService";
import { getAllCourses } from "../services/dsrcourseService";
import CreateLearningPlanModal from "../components/CreateLearningPlanModal";
import EditLearningPlanModal from "../components/EditLearningPlanModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";

const LearningPlanPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const [learningPlans, setLearningPlans] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigate = useNavigate();

  const fetchLearningPlans = async () => {
    if (!userId) return;
    const plans = await getMyLearningPlans(userId);
    setLearningPlans(plans);

    const courses = await getAllCourses();
    setAllCourses(courses);

    const enrolledIds = plans.flatMap((plan) => plan.relatedCourseIds || []);
    const uniqueEnrolledIds = [...new Set(enrolledIds)];

    const enrolledCourseDetails = courses.filter((course) =>
      uniqueEnrolledIds.includes(course.id)
    );
    setEnrolledCourses(enrolledCourseDetails);
  };

  useEffect(() => {
    fetchLearningPlans();
  }, []);

  const handleDeleteClick = (plan) => {
    setPlanToDelete(plan);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (planToDelete && planToDelete.id) {
      try {
        await deleteLearningPlan(planToDelete.id);
        fetchLearningPlans();
        setShowDeleteModal(false);
        setPlanToDelete(null);

        // Show success snackbar
        setSnackbarMessage(
          `"${planToDelete.title}" has been deleted successfully`
        );
        setShowSnackbar(true);

        // Hide snackbar after 3 seconds
        setTimeout(() => {
          setShowSnackbar(false);
        }, 3000);
      } catch (error) {
        console.error("Error deleting learning plan:", error);
        // Show error snackbar
        setSnackbarMessage("Failed to delete learning plan. Please try again.");
        setShowSnackbar(true);

        // Hide error snackbar after 3 seconds
        setTimeout(() => {
          setShowSnackbar(false);
        }, 3000);
      }
    }
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setShowEditModal(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Hello, {user?.name?.split(" ")[0] || "Learner"}
                </h2>
                <p className="text-gray-600 mt-1">
                  Track your progress and achieve your learning goals
                </p>
              </div>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
              onClick={() => setShowCreateModal(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Create New Plan
            </button>
          </div>

          {learningPlans.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-600 text-lg">No learning plans yet.</p>
              <button
                className="mt-4 bg-blue-100 text-blue-700 px-6 py-2 rounded-lg hover:bg-blue-200 transition duration-300"
                onClick={() => setShowCreateModal(true)}
              >
                Create your first plan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 mt-12 gap-6">
              {learningPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-blue-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300"
                >
                  <div className="p-5">
                    {/* Top section with time/duration */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-purple-600 font-medium mb-1">
                          {plan.scope || "Learning Plan"}
                        </p>
                        <p className="text-gray-800 font-bold text-lg">
                          {plan.startDate} - {plan.endDate}
                        </p>
                      </div>
                      <button className="text-gray-500 hover:text-gray-700">
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
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="border-b border-gray-200 mb-4 "></div>

                    {/* Content section */}
                    <div className="flex">
                      {/* Colorful icon */}
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center overflow-hidden">
                          {plan.skills && plan.skills[0] ? (
                            <span className="text-white font-bold text-lg">
                              {plan.skills[0].substring(0, 2).toUpperCase()}
                            </span>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                              />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Plan details */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {plan.title}
                        </h3>
                        <div className="flex items-center text-sm text-purple-600 mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          {plan.tasks?.length || 0} tasks
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-5 flex justify-between">
                      <button
                        onClick={() =>
                          navigate(`/learningplan/view/${plan.id}`)
                        }
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm"
                      >
                        View Details
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>

                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEdit(plan)}
                          className="text-gray-600 hover:text-green-600 transition-colors"
                          title="Edit"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() => {
                            const sharedPlans =
                              JSON.parse(localStorage.getItem("sharedPlans")) ||
                              [];
                            localStorage.setItem(
                              "sharedPlans",
                              JSON.stringify(sharedPlans)
                            );
                            navigate(`/learningplan/share/${plan.id}`);
                          }}
                          className="text-gray-600 hover:text-purple-600 transition-colors"
                          title="Share"
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
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleDeleteClick(plan)}
                          className="text-gray-600 hover:text-red-600 transition-colors"
                          title="Delete"
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Display Currently Learning Courses Section */}
        {enrolledCourses.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pl-2 border-l-4 border-green-600">
              Currently Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300 border border-gray-100"
                >
                  <div className="flex items-start">
                    <div className="bg-green-100 rounded-lg p-3 mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {course.title}
                      </h3>
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {course.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateLearningPlanModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchLearningPlans}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPlan && (
        <EditLearningPlanModal
          plan={selectedPlan}
          onClose={() => setShowEditModal(false)}
          onUpdated={fetchLearningPlans}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        itemName={planToDelete?.title || "this learning plan"}
      />
      {/* Snackbar Notification */}
      {showSnackbar && (
        <div className="fixed bottom-4 left-4 bg-red-600 text-white px-6 py-3 rounded shadow-lg flex items-center z-50 animate-fade-in-up">
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          {snackbarMessage}
        </div>
      )}
    </div>
  );
};

export default LearningPlanPage;
