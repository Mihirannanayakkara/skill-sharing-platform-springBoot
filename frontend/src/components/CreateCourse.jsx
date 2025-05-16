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
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
        <h2 className="text-3xl font-bold text-white">Create New Course</h2>
        <p className="text-blue-100 mt-2">Share your knowledge with the world</p>
      </div>

      <form className="p-6 space-y-6" onSubmit={handleSubmit}>
        {/* Course Basic Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Course Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
              <input 
                id="title"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                name="title" 
                placeholder="Enter a descriptive title" 
                onChange={handleInputChange} 
                value={form.title} 
                required 
              />
            </div>
            
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Course Description</label>
              <textarea 
                id="description"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-32" 
                name="description" 
                placeholder="Provide a detailed description of what students will learn" 
                onChange={handleInputChange} 
                value={form.description} 
                required 
                rows="4"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input 
                id="category"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                name="category" 
                placeholder="e.g. Programming, Design, Business" 
                onChange={handleInputChange} 
                value={form.category} 
              />
            </div>
            
            <div>
              <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
              <select 
                id="skillLevel"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white" 
                name="skillLevel" 
                value={form.skillLevel} 
                onChange={handleInputChange} 
                required
              >
                <option value="">Select Skill Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <input 
                id="language"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                name="language" 
                placeholder="e.g. English, Spanish" 
                onChange={handleInputChange} 
                value={form.language} 
              />
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input 
                id="duration"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                name="duration" 
                placeholder="e.g. 10 hours, 4 weeks" 
                onChange={handleInputChange} 
                value={form.duration} 
              />
            </div>
            
            <div>
              <label htmlFor="instructorName" className="block text-sm font-medium text-gray-700 mb-1">Instructor Name</label>
              <input 
                id="instructorName"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                name="instructorName" 
                placeholder="Your name as it will appear to students" 
                onChange={handleInputChange} 
                value={form.instructorName} 
              />
            </div>
            
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
              <div className="flex items-center space-x-2">
                <label className="flex-1 cursor-pointer flex items-center justify-center p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">Select Image</span>
                  <input 
                    id="coverImage"
                    type="file" 
                    accept="image/*" 
                    onChange={handleCoverImageChange} 
                    className="hidden" 
                  />
                </label>
                {form.coverImage && (
                  <span className="text-green-600 text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Image Selected
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            Course Lessons
          </h3>

          {form.lessons.map((lesson, index) => (
            <div key={index} className="mb-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-700">Lesson {index + 1}</h4>
                {form.lessons.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeLesson(index)} 
                    className="text-red-500 hover:text-red-700 text-sm flex items-center transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Remove Lesson
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor={`lessonTitle-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                  <input
                    id={`lessonTitle-${index}`}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter lesson title"
                    value={lesson.lessonTitle}
                    onChange={(e) => handleLessonChange(index, 'lessonTitle', e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor={`notes-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Lesson Notes</label>
                  <textarea
                    id={`notes-${index}`}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Add content, instructions, or notes for this lesson"
                    value={lesson.notes}
                    onChange={(e) => handleLessonChange(index, 'notes', e.target.value)}
                    rows="3"
                  />
                </div>
                
                <div>
                  <label htmlFor={`resource-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Resource (PDF or Image)</label>
                  <div className="flex items-center space-x-2">
                    <label className="flex-1 cursor-pointer flex items-center justify-center p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-gray-600">Upload Resource</span>
                      <input
                        id={`resource-${index}`}
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={(e) => handleLessonFileChange(index, e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                    {lesson.resourceName && (
                      <span className="text-green-600 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {lesson.resourceName.length > 15 
                          ? lesson.resourceName.substring(0, 15) + '...' 
                          : lesson.resourceName
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button 
            type="button" 
            onClick={addLesson} 
            className="mt-2 flex items-center justify-center w-full md:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all border border-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Another Lesson
          </button>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-lg shadow-md transition-all transform hover:scale-105"
          >
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;