import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentList from './pages/StudentList';
import EditStudent from './pages/EditStudent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/edit/:id" element={<EditStudent />} />
      </Routes>
    </Router>
  );
}

export default App;
