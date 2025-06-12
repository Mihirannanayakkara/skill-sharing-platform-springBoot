// src/pages/MyCourseDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const userId = localStorage.getItem('userId');

const user = JSON.parse(localStorage.getItem('user'));
//const userId = user?.id;

const MyCourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [checkedLessons, setCheckedLessons] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:8070/api/dsrcourses/${courseId}/user/${userId}`);
        if (!res.ok) {
          throw new Error('Course not found or unauthorized');
        }
        const data = await res.json();
        setCourse(data);
        const initialChecked = {};
        data.lessons.forEach((_, idx) => {
          initialChecked[idx] = false;
        });
        setCheckedLessons(initialChecked);
      } catch (error) {
        console.error('Failed to load course details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleCheckboxChange = (index) => {
    setCheckedLessons((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const allChecked = course?.lessons?.length > 0 &&
      Object.keys(checkedLessons).length === course.lessons.length &&
      Object.values(checkedLessons).every(Boolean);

  const completedLessonsCount = Object.values(checkedLessons).filter(Boolean).length;
  const totalLessons = course?.lessons?.length || 0;
  const progressPercentage = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;

  const handleFinishCourse = () => {
    navigate(`/certificate/${courseId}`, { state: { course, user } });
  };

  const download = (filename, base64Content, fileType) => {
    const linkSource = `data:application/${fileType};base64,${base64Content}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = filename;
    downloadLink.click();
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="p-8 bg-white rounded-xl shadow-lg">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-12 w-12 mb-4 text-blue-600">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-xl font-medium text-gray-700">Loading course details...</p>
            </div>
          </div>
        </div>
    );
  }

  if (!course) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h2>
              <p className="text-gray-600 mb-6">We couldn't find the course you're looking for or you may not have access to it.</p>
              <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to My Courses
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
              onClick={() => navigate(-1)}
              className="group flex items-center text-blue-600 font-medium mb-8 hover:text-blue-800 transition-colors"
              aria-label="Back to My Courses"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to My Courses
          </button>

          {/* Course Header */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10 transform transition-all duration-300 hover:shadow-2xl">
            <div className="relative">
              {course.coverImageBase64 ? (
                  <div className="w-full h-96 overflow-hidden">
                    <img
                        src={`data:image/png;base64,${course.coverImageBase64}`}
                        alt={`${course.title} cover`}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  </div>
              ) : (
                  <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
              )}

              {/* Course Title Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-10">
                <div className="max-w-3xl">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-md">
                    {course.title}
                  </h1>
                  {course.category && (
                      <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-500 bg-opacity-80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                      {course.category}
                    </span>
                        {course.skillLevel && (
                            <span className="bg-indigo-500 bg-opacity-80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                        {course.skillLevel}
                      </span>
                        )}
                      </div>
                  )}
                </div>
              </div>
            </div>

            {/* Course Description & Progress */}
            <div className="p-8 md:p-10">
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-grow space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      About This Course
                    </h2>

                    {/* Main course description */}
                    <p className="text-gray-600 leading-relaxed text-lg">{course.description}</p>
                  </div>

                  {/* Instructor information with avatar */}
                  {course.instructorName && (
                      <div className="flex items-center p-5 bg-blue-50 rounded-2xl">
                        <div className="h-14 w-14 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold mr-4">
                          {course.instructorName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-blue-600 font-medium">YOUR INSTRUCTOR</p>
                          <p className="text-lg font-semibold text-gray-800">{course.instructorName}</p>
                        </div>
                      </div>
                  )}
                </div>

                {/* Course details card */}
                <div className="lg:w-80 shrink-0">
                  <div className="bg-gray-50 rounded-2xl p-6 shadow-inner border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Course Details
                    </h3>
                    <div className="space-y-3 text-gray-600">
                      {course.duration && (
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="flex-grow">{course.duration}</p>
                          </div>
                      )}
                      {course.language && (
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                            <p className="flex-grow">{course.language}</p>
                          </div>
                      )}
                      {course.skillLevel && (
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <p className="flex-grow">{course.skillLevel}</p>
                          </div>
                      )}
                      {course.category && (
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <p className="flex-grow">{course.category}</p>
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 md:p-8 rounded-3xl shadow-inner border border-blue-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4 md:mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Your Progress
                  </h3>
                  <div className="text-sm flex items-center bg-white px-4 py-2 rounded-xl border border-blue-100 shadow-sm">
                    <span className="font-bold text-2xl text-blue-600">{completedLessonsCount}</span>
                    <span className="mx-2 text-gray-600">of</span>
                    <span className="font-bold text-2xl text-gray-800">{totalLessons}</span>
                    <span className="ml-2 text-gray-600">lessons completed</span>
                  </div>
                </div>
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <p className="text-sm text-gray-500 font-medium">Progress</p>
                  <p className="text-sm text-blue-700 font-bold bg-blue-100 px-3 py-1 rounded-full">
                    {progressPercentage.toFixed(0)}% complete
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lessons Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
            <div className="border-b border-gray-200 bg-gray-50 px-8 py-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                Course Lessons
                <span className="ml-3 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'}</span>
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {course.lessons && course.lessons.length > 0 ? (
                  course.lessons.map((lesson, idx) => (
                      <div
                          key={idx}
                          className={`p-6 md:p-8 flex items-start gap-5 transition-all duration-200 ${
                              checkedLessons[idx] ? 'bg-green-50' : 'hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={checkedLessons[idx] || false}
                                onChange={() => handleCheckboxChange(idx)}
                                className="form-checkbox h-6 w-6 text-blue-600 rounded-lg border-gray-300 focus:ring-blue-500 cursor-pointer transition-colors"
                                aria-label={`Mark lesson ${idx + 1} as completed`}
                            />
                            <span className="sr-only">Mark as completed</span>
                          </label>
                        </div>

                        <div className="flex-grow">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                              Lesson {idx + 1}
                            </div>
                            <h3 className="text-xl font-medium text-gray-800">
                              {lesson.lessonTitle || 'Untitled'}
                            </h3>

                            <div className="flex-shrink-0 ml-auto">
                        <span className={`flex h-8 w-8 rounded-full items-center justify-center ${
                            checkedLessons[idx]
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-400'
                        }`}>
                          {checkedLessons[idx] ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                          ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                          )}
                        </span>
                            </div>
                          </div>

                          <div className="mt-3 text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                            {lesson.notes || 'No notes available.'}
                          </div>

                          <div className="mt-6">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                              </svg>
                              Resources:
                            </h4>

                            {(lesson.resources || []).length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {lesson.resources.map((r, rIdx) => (
                                      <button
                                          key={rIdx}
                                          onClick={() => download(r.name, r.base64Content, r.type === 'pdf' ? 'pdf' : 'octet-stream')}
                                          className="flex items-center bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-800 hover:text-blue-700 px-4 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow group"
                                      >
                                        <div className="h-10 w-10 flex-shrink-0 mr-3 bg-blue-100 rounded-lg flex items-center justify-center">
                                          {r.type === 'pdf' ? (
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                              </svg>
                                          ) : (
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                              </svg>
                                          )}
                                        </div>
                                        <div className="flex-grow overflow-hidden">
                                          <span className="block font-medium truncate">{r.name}</span>
                                          <span className="text-xs text-gray-500">Click to download</span>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-500 group-hover:translate-y-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </button>
                                  ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 text-gray-500 italic p-4 rounded-xl border border-gray-100">
                                  No resources uploaded for this lesson.
                                </div>
                            )}
                          </div>
                        </div>
                      </div>
                  ))
              ) : (
                  <div className="py-16 px-8">
                    <div className="max-w-md mx-auto text-center">
                      <div className="bg-gray-100 h-32 w-32 mx-auto rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-gray-700 mb-2">No Lessons Found</h3>
                      <p className="text-gray-500">This course doesn't have any lessons yet. Check back later for updates.</p>
                    </div>
                  </div>
              )}
            </div>
          </div>

          {/* Completion Button */}
          {allChecked && (
              <div className="mt-12 mb-8 text-center">
                <div className="relative inline-block">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition duration-300"></div>
                  <button
                      onClick={handleFinishCourse}
                      className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-medium rounded-xl shadow-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Get Certificate
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default MyCourseDetail;