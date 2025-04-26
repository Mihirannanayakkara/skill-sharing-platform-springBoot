import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', description: '', skill: '', resourceLink: '' });
  const [editCourse, setEditCourse] = useState(null);
  const [error, setError] = useState('');

  // Fetch all courses on component load
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8085/api/courses');
      setCourses(response.data);
    } catch (error) {
      setError('Failed to fetch courses');
    }
  };

  // Handle input change for new or editing course
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editCourse) {
      setEditCourse({ ...editCourse, [name]: value });
    } else {
      setNewCourse({ ...newCourse, [name]: value });
    }
  };

  // Create a new course
  const handleCreate = async () => {
    try {
      await axios.post('http://localhost:8085/api/courses', newCourse);
      fetchCourses(); // Refresh the course list
      setNewCourse({ name: '', description: '', skill: '', resourceLink: '' });
    } catch (error) {
      setError('Failed to create course');
    }
  };

  // Update an existing course
  const handleUpdate = async () => {
    if (!editCourse) return;
    try {
      await axios.put(`http://localhost:8085/api/courses/${editCourse.id}`, editCourse);
      fetchCourses(); // Refresh the course list
      setEditCourse(null);
    } catch (error) {
      setError('Failed to update course');
    }
  };

  // Delete a course
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8085/api/courses/${id}`);
      fetchCourses(); // Refresh the course list
    } catch (error) {
      setError('Failed to delete course');
    }
  };

  return (
    <div>
      <h1>Course Management</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <h2>{editCourse ? 'Edit Course' : 'Create Course'}</h2>
      <form>
        <input
          type="text"
          name="name"
          placeholder="Course Name"
          value={editCourse ? editCourse.name : newCourse.name}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Course Description"
          value={editCourse ? editCourse.description : newCourse.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="skill"
          placeholder="Skill"
          value={editCourse ? editCourse.skill : newCourse.skill}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="resourceLink"
          placeholder="Resource Link"
          value={editCourse ? editCourse.resourceLink : newCourse.resourceLink}
          onChange={handleInputChange}
        />
        <button type="button" onClick={editCourse ? handleUpdate : handleCreate}>
          {editCourse ? 'Update Course' : 'Create Course'}
        </button>
      </form>

      <h2>All Courses</h2>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <strong>{course.name}</strong> ({course.skill}) 
            <button onClick={() => setEditCourse(course)}>Edit</button>
            <button onClick={() => handleDelete(course.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseManagement;
