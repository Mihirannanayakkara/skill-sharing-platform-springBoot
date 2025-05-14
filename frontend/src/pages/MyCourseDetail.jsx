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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
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

  const allChecked = Object.values(checkedLessons).every(Boolean);

  const handleFinishCourse = () => {
    navigate(`/certificate/${courseId}`, { state: { course, user } });
  };

  if (!course) {
    return <p className="p-6 text-center">Loading course details...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 underline mb-4"
      >
        ← Back to My Courses
      </button>

      <h2 className="text-3xl font-bold mb-4">{course.title}</h2>
      <p className="mb-2"><strong>Description:</strong> {course.description}</p>
      <p className="mb-2"><strong>Category:</strong> {course.category}</p>
      <p className="mb-2"><strong>Skill Level:</strong> {course.skillLevel}</p>
      <p className="mb-2"><strong>Language:</strong> {course.language}</p>
      <p className="mb-2"><strong>Duration:</strong> {course.duration}</p>
      <p className="mb-4"><strong>Instructor:</strong> {course.instructorName}</p>

      {course.coverImageBase64 && (
        <img
          src={`data:image/png;base64,${course.coverImageBase64}`}
          alt="Course cover"
          className="mb-6 w-full max-w-md rounded"
        />
      )}

      <h3 className="text-xl font-semibold mt-6 mb-4">Lessons</h3>
      {course.lessons && course.lessons.length > 0 ? (
        course.lessons.map((lesson, idx) => (
          <div key={idx} className="mb-6 border rounded p-4 bg-gray-50 flex items-center gap-10">
            <input
              type="checkbox"
              checked={checkedLessons[idx] || false}
              onChange={() => handleCheckboxChange(idx)}
              className="w-5 h-5"
            />
            <div>
              <h4 className="text-lg font-semibold mb-2">Lesson {idx + 1}: {lesson.lessonTitle || 'Untitled'}</h4>
              <p className="mb-2">{lesson.notes || 'No notes available.'}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No lessons found for this course.</p>
      )}

      {allChecked && (
        <div className="mt-8 text-center">
          <button
            onClick={handleFinishCourse}
            className="px-6 py-3 bg-green-600 text-white rounded shadow hover:bg-green-700"
          >
            Finish Course
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCourseDetail;
