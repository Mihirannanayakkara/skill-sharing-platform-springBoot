import React, { useState, useEffect } from 'react';

const SkillSection = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const fetchSkills = async () => {
    const res = await fetch(`http://localhost:8070/api/skills/${userId}`);
    const data = await res.json();
    setSkills(data);
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    await fetch('http://localhost:8070/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newSkill, userId })
    });
    setNewSkill('');
    fetchSkills();
  };

  const handleDeleteSkill = async (id) => {
    await fetch(`http://localhost:8070/api/skills/${id}`, {
      method: 'DELETE'
    });
    fetchSkills();
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-xl font-semibold mb-2">Skills</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter new skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="border p-2 w-full"
        />
        <button onClick={handleAddSkill} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {skills.map((skill) => (
          <li key={skill.id} className="flex justify-between items-center border p-2 rounded">
            <span>{skill.name}</span>
            <button
              onClick={() => handleDeleteSkill(skill.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillSection;
