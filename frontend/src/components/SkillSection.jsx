import React, { useState, useEffect } from 'react';
import { PlusCircle, X, CheckCircle, Loader2, ChevronRight } from 'lucide-react';

const SkillSection = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8070/api/skills/${userId}`);
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    
    setIsSubmitting(true);
    try {
      await fetch('http://localhost:8070/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSkill, userId })
      });
      setNewSkill('');
      fetchSkills();
    } catch (error) {
      console.error("Failed to add skill:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    setSkillToDelete(id);
    try {
      await fetch(`http://localhost:8070/api/skills/${id}`, {
        method: 'DELETE'
      });
      fetchSkills();
    } catch (error) {
      console.error("Failed to delete skill:", error);
    } finally {
      setSkillToDelete(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSkill();
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-750">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Skills
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Add your professional skills to showcase your expertise
        </p>
      </div>

      {/* Add Skill Form */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Enter new skill (e.g., JavaScript, Project Management, UX Design)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Enter new skill"
            />
          </div>
          <button 
            onClick={handleAddSkill}
            disabled={!newSkill.trim() || isSubmitting}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:cursor-not-allowed min-w-fit"
            aria-label="Add skill"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <PlusCircle className="h-5 w-5" />
                <span>Add Skill</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Skills List */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-10">
            <CheckCircle className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No skills added yet</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Add your technical and professional skills to showcase your expertise to potential employers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {skills.map((skill) => (
              <div 
                key={skill.id}
                className="group flex justify-between items-center bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">{skill.name}</span>
                </div>
                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  disabled={skillToDelete === skill.id}
                  className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 opacity-70 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`Delete ${skill.name} skill`}
                >
                  {skillToDelete === skill.id ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  ) : (
                    <X className="h-5 w-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillSection;