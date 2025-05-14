// src/components/CourseProgress.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const userId = localStorage.getItem('userId');

const CourseProgress = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:8070/api/dsrcourses');
      setCourses(await res.json());
    } catch (err) {
      console.error('Error fetching courses:', err);
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
    if (res.ok) fetchMyCourses();
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
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Do a Course</h2>
      <input
        type="text"
        placeholder="Search course..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full p-2 border mb-4 rounded"
      />
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {courses
          .filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
          .map(c => (
            <div key={c.id} className="border p-3 rounded hover:bg-gray-50">
              <h3 className="font-semibold">{c.title}</h3>
              <button
                className="text-blue-600 underline"
                onClick={() => setSelected(c)}
              >
                View
              </button>
            </div>
          ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded w-full max-w-xl relative">
            <h2 className="text-xl font-bold">{selected.title}</h2>
            <p className="mt-2">{selected.description}</p>
            <p className="mt-1"><strong>Instructor:</strong> {selected.instructorName}</p>
            <p className="mt-1"><strong>Duration:</strong> {selected.duration}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEnroll(selected.id)}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Enroll
              </button>
              {/* <button
                onClick={() => handleFinish(selected.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Finish
              </button> */}
            </div>
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-4 text-red-600 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold my-6">My Courses</h2>
      <div className="space-y-4">
        {myCourses.map(c => (
          <div
            key={c.id}
            className="border p-4 rounded flex justify-between items-center hover:bg-gray-100"
          >
            <span
              className="text-xl font-semibold text-blue-600 underline cursor-pointer"
              onClick={() => navigate(`/my-course/${c.id}`)}
            >
              {c.title}
            </span>
            <button
              onClick={() => handleUnenroll(c.id)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Unenroll
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseProgress;
