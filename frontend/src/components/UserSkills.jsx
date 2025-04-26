import React, { useEffect, useState } from "react";
import axios from "axios";

const UserSkills = () => {
  const userId = "680a0de045c925018e55f1f3"; // Replace with dynamic ID if needed
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/skills/${userId}`
        );
        setSkills(response.data || []);
      } catch (err) {
        console.error("Error fetching user skills:", err);
        setError("Failed to load user skills.");
      }
    };

    if (userId) {
      fetchSkills();
    }
  }, [userId]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-skills">
      <h2>User Skills</h2>
      {skills.length === 0 ? (
        <p>No skills found for this user.</p>
      ) : (
        <ul>
          {skills.map((skill, index) => (
            <li key={skill?.id || index}>{skill?.name || "Unnamed Skill"}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSkills;
