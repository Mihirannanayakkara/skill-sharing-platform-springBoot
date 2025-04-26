// ProgressUpdateService.js
import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8081/api/v1/progress-updates";

export const getProgressUpdates = async () => {
  try {
    const response = await axios.get(REST_API_BASE_URL);
    return response.data; // Returning the response data
  } catch (error) {
    console.error("Error fetching progress updates:", error);
    throw error; // Throwing the error so it can be caught in the component
  }
};

export const createProgressUpdate = async (progressUpdate) => {
  const response = await axios.post(REST_API_BASE_URL, progressUpdate);
  return response.data;
};

// Get progress updates by userId
export const getProgressUpdatesByUserId = async (userId) => {
  try {
    const response = await axios.get(`${REST_API_BASE_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching progress updates for user ${userId}:`, error);
    throw error;
  }
};
