import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/students')
      .then(res => setStudents(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this student?")) {
      await axios.delete(`http://localhost:5000/students/${id}`);
      setStudents(students.filter(s => s._id !== id));
    }
  };

  return (
    <div className="container mt-5">
      <h2>Student List</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Course</th>
            <th>Delivery</th><th>Lecture</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.course}</td>
              <td>{s.deliveryMode}</td>
              <td>{s.lectureMode}</td>
              <td>
                <Link to={`/edit/${s._id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/" className="btn btn-primary mt-3">Back to Form</Link>
    </div>
  );
}

export default StudentList;
