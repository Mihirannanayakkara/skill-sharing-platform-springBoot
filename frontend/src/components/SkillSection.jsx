import React, { useState, useEffect } from 'react';
import { PlusCircle, X, CheckCircle, Loader2, ChevronRight } from 'lucide-react';

const SkillSection = ({ userId, viewOnly = false }) => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

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
  }, [userId]);

  return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
          </div>
          <p className="text-sm text-gray-500">
            Add your professional skills to showcase your expertise
          </p>
        </div>

        {!viewOnly && (
            <div className="px-6 py-4">
              <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Enter new skill (e.g., JavaS"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200"
                />
                <button
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim() || isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                      <PlusCircle className="h-5 w-5" />
                  )}

                </button>
              </div>
            </div>
        )}

        {/* Skills List */}
        <div className="p-6">
          {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600"></div>
              </div>
          ) : skills.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No skills added yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Add your technical and professional skills to showcase your expertise.
                </p>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skills.map((skill) => (
                    <div
                        key={skill.id}
                        className="group flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 transition-all duration-200 hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{skill.name}</span>
                      </div>
                      {!viewOnly && (
                          <button
                              onClick={() => handleDeleteSkill(skill.id)}
                              disabled={skillToDelete === skill.id}
                              className="p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                              aria-label={`Delete ${skill.name} skill`}
                          >
                            {skillToDelete === skill.id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <X className="h-5 w-5" />
                            )}
                          </button>
                      )}
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
};

export default SkillSection;