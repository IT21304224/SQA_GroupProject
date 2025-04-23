import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    course: '',
    deliveryMode: 'Weekday',
    lectureMode: 'Online'
  });

  const handleSubmit = async () => {
    await axios.post('http://localhost:5000/students', form);
    setForm({
      name: '',
      email: '',
      course: '',
      deliveryMode: 'Weekday',
      lectureMode: 'Online'
    });
    navigate('/students');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">📚 Student Registration</h2>
      <div className="card p-4 shadow-sm">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Course Name"
              value={form.course}
              onChange={e => setForm({ ...form, course: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Delivery Mode</label>
            <select
              className="form-select"
              value={form.deliveryMode}
              onChange={e => setForm({ ...form, deliveryMode: e.target.value })}
            >
              <option value="Weekday">Weekday</option>
              <option value="Weekend">Weekend</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Lecture Mode</label>
            <select
              className="form-select"
              value={form.lectureMode}
              onChange={e => setForm({ ...form, lectureMode: e.target.value })} //check
            >
              <option value="Online">Online</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>

          <div className="col-12 text-end mt-3 d-flex justify-content-between">
            <button className="btn btn-primary" onClick={() => navigate('/students')}>
              View Student List
            </button>
            <button className="btn btn-success" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
