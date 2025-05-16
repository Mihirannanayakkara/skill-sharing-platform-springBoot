// src/components/CourseProgress.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const userId = localStorage.getItem('userId');

const CourseProgress = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8070/api/dsrcourses');
      setCourses(await res.json());
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyCourses = async () => {
    try {
      const res = await fetch(`http://localhost:8070/api/dsrcourses/enrolled/${userId}`);
      setMyCourses(await res.json());
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchMyCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    const res = await fetch(
      `http://localhost:8070/api/dsrcourses/${courseId}/enroll/${userId}`,
      { method: 'POST' }
    );
    if (res.ok) {
      fetchMyCourses();
      setSelected(null);
    }
  };

  const handleFinish = async (courseId) => {
    const res = await fetch(
      `http://localhost:8070/api/dsrcourses/${courseId}/complete/${userId}`,
      { method: 'POST' }
    );
    if (res.ok) fetchMyCourses();
  };

  // NEW: Unenroll only this user from the course
  const handleUnenroll = async (courseId) => {
    if (!window.confirm('Unenroll from this course?')) return;
    const res = await fetch(
      `http://localhost:8070/api/dsrcourses/${courseId}/enroll/${userId}`,
      { method: 'DELETE' }
    );
    if (res.ok) {
      alert('You have been unenrolled.');
      fetchMyCourses();
    } else {
      alert('Unenroll failed.');
    }
  };

  const download = (name, content, type) => {
    const link = document.createElement('a');
    link.href = `data:application/${type};base64,${content}`;
    link.download = name;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Course Discovery Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Discover Courses
        </h2>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search course by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
        </div>
        
        {/* Course Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No courses available at this time.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses
              .filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
              .map(c => (
                <div 
                  key={c.id} 
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
                    {c.coverImageBase64 ? (
                      <img
                        src={`data:image/png;base64,${c.coverImageBase64}`}
                        alt="Course cover"
                        className="object-cover h-full w-full"
                      />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{c.title}</h3>
                    <p className="text-gray-600 line-clamp-2 mb-4 h-12">{c.description || "Explore this course to learn more"}</p>
                    <button
                      className="w-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2 px-4 rounded-md font-medium transition-colors duration-200"
                      onClick={() => setSelected(c)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
        
        {/* Course with no results */}
        {!isLoading && courses.length > 0 && 
          courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase())).length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No courses match your search. Try different keywords.
          </div>
        )}
      </div>

      {/* My Courses Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          My Courses
        </h2>
        
        {myCourses.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No enrolled courses</h3>
            <p className="mt-1 text-gray-500">Get started by enrolling in a course above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myCourses.map(c => (
              <div
                key={c.id}
                className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition-colors duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{c.title}</h3>
                  <p className="text-gray-600 text-sm">{c.instructorName ? `Instructor: ${c.instructorName}` : ''}</p>
                </div>
                <div className="flex gap-3 self-end sm:self-auto">
                  <button
                    onClick={() => navigate(`/my-course/${c.id}`)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>
                  <button
                    onClick={() => handleUnenroll(c.id)}
                    className="px-4 py-2 bg-white border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
                  >
                    Unenroll
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Course Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fadeIn"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-700 relative">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-20 rounded-full p-1 hover:bg-opacity-30 transition-all duration-200"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{selected.title}</h2>
              <p className="text-gray-600 mb-6">{selected.description || "No description available."}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span><strong>Instructor:</strong> {selected.instructorName || "Not specified"}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Duration:</strong> {selected.duration || "Not specified"}</span>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setSelected(null)}
                  className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEnroll(selected.id)}
                  className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseProgress;