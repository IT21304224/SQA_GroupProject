// controllers/studentController.js
const Student = require('../models/Student');
const { validationResult } = require('express-validator');

// @route   POST /api/students
// @desc    Create a new student record
// @access  Public (Add auth later if needed)
exports.createStudent = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if username or email already exists (optional, but good practice)
    const { username, email } = req.body;
    let existingStudent = await Student.findOne({ $or: [{ username }, { email }] });
    if (existingStudent) {
       let field = existingStudent.username === username ? 'Username' : 'Email';
       return res.status(400).json({ errors: [{ msg: `${field} already exists` }] });
    }


    // Create a new student instance from request body
    const newStudent = new Student(req.body);

    // Save the student to the database
    const savedStudent = await newStudent.save();

    res.status(201).json(savedStudent); // 201 Created status

  } catch (err) {
    console.error('Error creating student:', err.message);
    // Handle potential duplicate key errors during save, though checked above
    if (err.code === 11000) {
         let field = Object.keys(err.keyValue)[0];
         field = field.charAt(0).toUpperCase() + field.slice(1); // Capitalize
         return res.status(400).json({ errors: [{ msg: `${field} already exists.` }] });
    }
    res.status(500).send('Server Error');
  }
};

// @route   GET /api/students/:id
// @desc    Get a student profile by ID
// @access  Public (Add auth later if needed)
exports.getStudentById = async (req, res) => {
   // Check for validation errors (for the ID)
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }

  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    res.json(student);

  } catch (err) {
    console.error('Error fetching student:', err.message);
    // Handle CastError for invalid ObjectId format
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Student not found (invalid ID format)' });
    }
    res.status(500).send('Server Error');
  }
};

// @route   PUT /api/students/:id
// @desc    Update a student record
// @access  Public (Add auth later if needed)
exports.updateStudent = async (req, res) => {
  // Check for validation errors (for ID and body)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const updateData = req.body;

  try {
    let student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Optional: Prevent username/email changes or check for uniqueness if changed
    if (updateData.username && updateData.username !== student.username) {
        const existing = await Student.findOne({ username: updateData.username });
        if (existing && existing._id.toString() !== id) {
            return res.status(400).json({ errors: [{ msg: 'Username already exists' }] });
        }
    }
     if (updateData.email && updateData.email !== student.email) {
        const existing = await Student.findOne({ email: updateData.email });
        if (existing && existing._id.toString() !== id) {
            return res.status(400).json({ errors: [{ msg: 'Email already exists' }] });
        }
    }


    // Find the student by ID and update it with the request body
    // { new: true } returns the updated document
    // { runValidators: true } ensures schema validations run on update
    student = await Student.findByIdAndUpdate(
      id,
      { $set: updateData }, // Use $set to update only provided fields
      { new: true, runValidators: true, context: 'query' } // context:'query' helps with unique validation on update if needed
    );

    res.json(student);

  } catch (err) {
    console.error('Error updating student:', err.message);
     // Handle potential duplicate key errors during update
    if (err.code === 11000) {
         let field = Object.keys(err.keyValue)[0];
         field = field.charAt(0).toUpperCase() + field.slice(1); // Capitalize
         return res.status(400).json({ errors: [{ msg: `${field} already exists.` }] });
    }
     // Handle CastError for invalid ObjectId format
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Student not found (invalid ID format)' });
    }
    res.status(500).send('Server Error');
  }
};

// Add functions for getAllStudents, deleteStudent etc. here if needed later