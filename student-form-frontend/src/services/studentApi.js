// src/services/studentApi.js
import axios from 'axios';

// IMPORTANT: Replace with the actual URL where your backend is running
const API_BASE_URL = 'http://localhost:5001/api/students';

// Set default headers for axios if needed (e.g., Content-Type)
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Function to create a new student
export const createStudent = async (studentData) => {
  try {
    const response = await axios.post(API_BASE_URL, studentData);
    return response.data; // Return the created student data (includes _id)
  } catch (error) {
    console.error("Error creating student:", error.response ? error.response.data : error.message);
    // Re-throw the error or return a specific error object for handling in the component
    throw error.response ? error.response.data : new Error('API request failed');
  }
};

// Function to get a student by ID
export const getStudentById = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${studentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching student ${studentId}:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('API request failed');
  }
};

// Function to update a student by ID
export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${studentId}`, studentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating student ${studentId}:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('API request failed');
  }
};

// Add other API functions if needed (getAllStudents, deleteStudent, etc.)