// routes/studentRoutes.js
const express = require('express');
const { body, param } = require('express-validator');
const studentController = require('../controllers/studentController');

const router = express.Router();

// --- Validation Rules ---
const studentValidationRules = [
  body('fullName').notEmpty().withMessage('Full Name is required').trim(),
  body('username').notEmpty().withMessage('Username is required').trim(),
  // Basic email format validation
  body('email').isEmail().withMessage('Must be a valid email address').normalizeEmail(),
  body('dateOfBirth').isISO8601().toDate().withMessage('Date of Birth must be a valid date'),
  // Allow empty string or valid enum value for gender
  body('gender').optional({ checkFalsy: true }).isIn(['Male', 'Female', 'Other', 'Prefer not to say']).withMessage('Invalid Gender selected'),
  body('phone').notEmpty().withMessage('Phone Number is required').isMobilePhone('any', { strictMode: false }).withMessage('Invalid phone number format'),
  // Optional fields don't need explicit 'notEmpty' but can have format checks if needed
  body('alternatePhone').optional({ checkFalsy: true }).isMobilePhone('any', { strictMode: false }).withMessage('Invalid alternate phone number format'),
  // Add more specific validations as needed for other fields (length, format, etc.)
  body('permanentAddress').optional({ checkFalsy: true }).trim(),
  body('currentAddress').optional({ checkFalsy: true }).trim(),
  body('city').optional({ checkFalsy: true }).trim(),
  body('state').optional({ checkFalsy: true }).trim(),
  body('zipCode').optional({ checkFalsy: true }).trim(),
  body('country').optional({ checkFalsy: true }).trim(),
  body('courseProgram').optional({ checkFalsy: true }).trim(),
  body('department').optional({ checkFalsy: true }).trim(),
  body('fatherName').optional({ checkFalsy: true }).trim(),
  body('motherName').optional({ checkFalsy: true }).trim(),
  body('guardianName').optional({ checkFalsy: true }).trim(),
  body('guardianContact').optional({ checkFalsy: true }).trim(),
  // Validation for nested emergency contacts
  body('emergencyContact1.name').optional({ checkFalsy: true }).trim(),
  body('emergencyContact1.phone').optional({ checkFalsy: true }).isMobilePhone('any', { strictMode: false }).withMessage('Invalid emergency contact 1 phone number'),
  body('emergencyContact2.name').optional({ checkFalsy: true }).trim(),
  body('emergencyContact2.phone').optional({ checkFalsy: true }).isMobilePhone('any', { strictMode: false }).withMessage('Invalid emergency contact 2 phone number'),
];

const idValidationRule = [
  param('id').isMongoId().withMessage('Invalid student ID format')
];


// --- Routes ---

// POST /api/students - Create a new student (applies validation rules)
router.post('/', studentValidationRules, studentController.createStudent);

// GET /api/students/:id - Get a student by ID (applies ID validation)
router.get('/:id', idValidationRule, studentController.getStudentById);

// PUT /api/students/:id - Update a student by ID (applies ID and student validation rules)
// Note: PUT usually replaces the entire resource, PATCH updates parts. We'll use PUT for simplicity here,
// but ensure the frontend sends all fields or adjust validation/controller logic for PATCH.
router.put('/:id', idValidationRule, studentValidationRules, studentController.updateStudent);

// Optional: GET /api/students - Get all students (Add later if needed)
// router.get('/', studentController.getAllStudents);

// Optional: DELETE /api/students/:id - Delete a student (Add later if needed)
// router.delete('/:id', idValidationRule, studentController.deleteStudent);


module.exports = router;