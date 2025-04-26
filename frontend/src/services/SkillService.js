// SkillService.js
import axios from "axios";

const SKILL_API_BASE_URL = "http://localhost:8081/api/v1/skills";

// Get all skills
export const getAllSkills = async () => {
  try {
    const response = await axios.get(SKILL_API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching all skills:", error);
    throw error;
  }
};

// Add a skill to a specific user
export const addSkillToUser = async (userId, skillName) => {
  try {
    const response = await axios.post(`${SKILL_API_BASE_URL}/${userId}`, {
      skillName,
    });
    return response.data; // Returns updated skill names list
  } catch (error) {
    console.error(`Error adding skill to user ${userId}:`, error);
    throw error;
  }
};

// Get skills for a specific user
export const getUserSkills = async (userId) => {
  try {
    const response = await axios.get(`${SKILL_API_BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching skills for user ${userId}:`, error);
    throw error;
  }
};

// Remove a specific skill from a user
export const removeSkillFromUser = async (userId, skillId) => {
  try {
    const response = await axios.delete(
      `${SKILL_API_BASE_URL}/${userId}/${skillId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error removing skill ${skillId} from user ${userId}:`,
      error
    );
    throw error;
  }
};
