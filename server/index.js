const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/schoolDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Student Schema
const Student = mongoose.model('Student', {
  name: String,
  email: String,
  course: String,
  deliveryMode: String, // Weekday or Weekend
  lectureMode: String   // Online or Onsite
});

// Routes
app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.post('/students', async (req, res) => {
  const student = await Student.create(req.body);
  res.json(student);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
