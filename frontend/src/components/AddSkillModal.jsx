import React, { useState } from 'react';

const AddSkillModal = ({ isOpen, onClose, onAddSkill }) => {
    const [newSkill, setNewSkill] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (newSkill.trim()) {
            onAddSkill(newSkill);
            setNewSkill('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[500px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add Skill</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Manual Skill Entry */}
                    <div>
                        <label className="block mb-2">Enter a new skill</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="e.g., JavaScript, Project Management"
                                className="flex-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                            />
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Course Skills Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="font-medium">Add from completed courses</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Search courses or skills..."
                            className="w-full border rounded-md p-2 mb-2"
                        />
                        <div className="text-center text-gray-500 py-4">
                            No completed courses found
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Add Skill
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSkillModal;