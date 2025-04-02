const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/schoolDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Models
const Student = mongoose.model('Student', {
  name: String,
  age: Number,
  email: String,
});

const Course = mongoose.model('Course', {
  title: String,
  code: String,
  description: String,
});

// Routes - Students
app.get('/students', async (req, res) => res.json(await Student.find()));
app.post('/students', async (req, res) => res.json(await Student.create(req.body)));
app.put('/students/:id', async (req, res) => res.json(await Student.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/students/:id', async (req, res) => res.json(await Student.findByIdAndDelete(req.params.id)));

// Routes - Courses
app.get('/courses', async (req, res) => res.json(await Course.find()));
app.post('/courses', async (req, res) => res.json(await Course.create(req.body)));
app.put('/courses/:id', async (req, res) => res.json(await Course.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/courses/:id', async (req, res) => res.json(await Course.findByIdAndDelete(req.params.id)));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
