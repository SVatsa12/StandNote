// File: src/api/user.js
import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/users";

/**
 * Gets the profile data for the currently logged-in user.
 */
export const getProfile = async () => {
  // Reads the token that was saved during login.
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      // Sends the token to the backend for verification.
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Updates the profile data for the currently logged-in user.
 */
export const updateProfile = async (data) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${API_URL}/update`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};