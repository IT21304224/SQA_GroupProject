const express = require('express');
const router = express.Router();
const Student = require('../models/Student');


app.post('/upload-profile', upload.single('profile'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  res.json({
    path: req.file.path
  });
});

// Create Student
router.post('/', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Student by Email
router.get('/:email', async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.params.email });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Student
router.put('/:email', async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add route for file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ path: req.file.path });
  });


module.exports = router;