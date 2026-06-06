// File: src/api/auth.js
import axios from 'axios';

const AUTH_URL = "https://standnote.onrender.com/api/v1/auth";
const USER_URL = "https://standnote.onrender.com/api/v1/users";

export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('email', email);
  formData.append('password', password);

  try {
    const response = await axios.post(`${AUTH_URL}/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data; // This is the object with the access_token
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || "Login failed.");
    }
    throw new Error("An unexpected network error occurred during login.");
  }
};

export const signupUser = async (email, password) => {
  try {
    const response = await axios.post(`${USER_URL}/register`, { email, password });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || "Signup failed.");
    }
    throw new Error("An unexpected network error occurred during signup.");
  }
};