// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StudentForm from './pages/StudentForm';
// Import the profile page component once created
import StudentProfile from './pages/StudentProfile'; // Placeholder for now
import './App.css';

function App() {
  return (
    <Router>
      <div>
        {/* Optional: Basic Navigation */}
        <nav className="navbar">
          <Link to="/">Home (Add Student)</Link>
          {/* Add other links if needed */}
        </nav>

        {/* Main Content Area */}
        <div className="container">
          <Routes>
            {/* Route for the student creation form */}
            <Route path="/" element={<StudentForm />} />

            {/* Route for displaying a student's profile */}
            {/* The :id part is a URL parameter */}
            <Route path="/profile/:id" element={<StudentProfile />} />

            {/* Add other routes here if needed */}
            {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;