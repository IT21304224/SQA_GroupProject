import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    course: '',
    deliveryMode: 'Weekday',
    lectureMode: 'Online'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get('http://localhost:5000/students');
    setStudents(res.data);
  };

  const addStudent = async () => {
    await axios.post('http://localhost:5000/students', form);
    setForm({
      name: '',
      email: '',
      course: '',
      deliveryMode: 'Weekday',
      lectureMode: 'Online'
    });
    fetchStudents();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📚 Student Registration</h2>

      <input
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      /><br />

      <input
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      /><br />

      <input
        placeholder="Course Name"
        value={form.course}
        onChange={e => setForm({ ...form, course: e.target.value })}
      /><br />

      <label>Delivery Mode:</label><br />
      <select
        value={form.deliveryMode}
        onChange={e => setForm({ ...form, deliveryMode: e.target.value })}
      >
        <option value="Weekday">Weekday</option>
        <option value="Weekend">Weekend</option>
      </select><br />

      <label>Lecture Mode:</label><br />
      <select
        value={form.lectureMode}
        onChange={e => setForm({ ...form, lectureMode: e.target.value })}
      >
        <option value="Online">Online</option>
        <option value="Onsite">Onsite</option>
      </select><br /><br />

      <button onClick={addStudent}>Submit</button>

      <h3>Registered Students</h3>
      <ul>
        {students.map(s => (
          <li key={s._id}>
            {s.name} | {s.email} | {s.course} | {s.deliveryMode} | {s.lectureMode}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
