import React, { useState } from 'react';

const CreateCourse = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    skillLevel: '',
    language: '',
    duration: '',
    coverImage: '',
    instructorName: '',
    lessons: [
      { lessonTitle: '', notes: '', resourceFile: null, resourceBase64: '', resourceName: '', resourceType: '' }
    ]
  });

  const creatorId = JSON.parse(localStorage.getItem('user'))?.id;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      setForm(prev => ({ ...prev, coverImage: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleLessonChange = (index, field, value) => {
    const updatedLessons = [...form.lessons];
    updatedLessons[index][field] = value;
    setForm({ ...form, lessons: updatedLessons });
  };

  const handleLessonFileChange = (index, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      const updatedLessons = [...form.lessons];
      updatedLessons[index].resourceBase64 = base64;
      updatedLessons[index].resourceName = file.name;
      updatedLessons[index].resourceType = file.type.includes('pdf') ? 'pdf' : 'image';
      setForm({ ...form, lessons: updatedLessons });
    };
    reader.readAsDataURL(file);
  };

  const addLesson = () => {
    setForm({
      ...form,
      lessons: [...form.lessons, {
        lessonTitle: '', notes: '', resourceFile: null,
        resourceBase64: '', resourceName: '', resourceType: ''
      }]
    });
  };

  const removeLesson = (index) => {
    const updated = form.lessons.filter((_, i) => i !== index);
    setForm({ ...form, lessons: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const coursePayload = {
      title: form.title,
      description: form.description,
      category: form.category,
      skillLevel: form.skillLevel,
      language: form.language,
      duration: form.duration,
      coverImageBase64: form.coverImage,
      instructorName: form.instructorName,
      createdByUserId: creatorId,
      lessons: form.lessons.map(lesson => ({
        lessonTitle: lesson.lessonTitle,
        notes: lesson.notes,
        resources: lesson.resourceBase64 ? [{
          name: lesson.resourceName,
          base64Content: lesson.resourceBase64,
          type: lesson.resourceType
        }] : []
      }))
    };

    try {
      const res = await fetch('http://localhost:8070/api/dsrcourses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coursePayload)
      });

      if (res.ok) {
        alert('Course created successfully!');
        setForm({
          title: '', description: '', category: '', skillLevel: '',
          language: '', duration: '', coverImage: '', instructorName: '',
          lessons: [
            { lessonTitle: '', notes: '', resourceFile: null, resourceBase64: '', resourceName: '', resourceType: '' }
          ]
        });
      } else {
        alert('Failed to create course.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-semibold mb-4">Create New Course</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input className="w-full p-2 border" name="title" placeholder="Course Title" onChange={handleInputChange} value={form.title} required />
        <textarea className="w-full p-2 border" name="description" placeholder="Course Description" onChange={handleInputChange} value={form.description} required />
        <input className="w-full p-2 border" name="category" placeholder="Category" onChange={handleInputChange} value={form.category} />
        <select className="w-full p-2 border" name="skillLevel" value={form.skillLevel} onChange={handleInputChange} required>
          <option value="">Select Skill Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <input className="w-full p-2 border" name="language" placeholder="Language" onChange={handleInputChange} value={form.language} />
        <input className="w-full p-2 border" name="duration" placeholder="Duration (e.g., 10 hours)" onChange={handleInputChange} value={form.duration} />
        <input className="w-full p-2 border" name="instructorName" placeholder="Instructor Name" onChange={handleInputChange} value={form.instructorName} />

        <label className="block">Cover Image</label>
        <input type="file" accept="image/*" onChange={handleCoverImageChange} className="w-full" />

        <hr className="my-4" />
        <h3 className="text-xl font-semibold">Lessons</h3>

        {form.lessons.map((lesson, index) => (
          <div key={index} className="border p-4 rounded mb-4 space-y-2 bg-gray-50">
            <input
              className="w-full p-2 border"
              placeholder="Lesson Title"
              value={lesson.lessonTitle}
              onChange={(e) => handleLessonChange(index, 'lessonTitle', e.target.value)}
            />
            <textarea
              className="w-full p-2 border"
              placeholder="Lesson Notes"
              value={lesson.notes}
              onChange={(e) => handleLessonChange(index, 'notes', e.target.value)}
            />
            <label className="block">Upload Resource (Image or PDF)</label>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => handleLessonFileChange(index, e.target.files[0])}
              className="w-full"
            />
            {form.lessons.length > 1 && (
              <button type="button" onClick={() => removeLesson(index)} className="text-red-600 underline text-sm">Remove Lesson</button>
            )}
          </div>
        ))}

        <button type="button" onClick={addLesson} className="bg-gray-700 text-white px-4 py-1 rounded">+ Add Another Lesson</button>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Create Course</button>
      </form>
    </div>
  );
};

export default CreateCourse;
