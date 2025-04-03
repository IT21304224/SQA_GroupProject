const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://apuathuckorala:palinda2001@cluster0.sqgqjor.mongodb.net/schoolDB?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Mongoose Schema
const Student = mongoose.model('Student', {
  name: String,
  email: String,
  course: String,
  deliveryMode: String, // Weekday or Weekend
  lectureMode: String   // Online or Onsite
});

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student API',
      version: '1.0.0',
      description: 'API for managing student records',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./index.js'], // Path to the file with Swagger comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - course
 *         - deliveryMode
 *         - lectureMode
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         course:
 *           type: string
 *         deliveryMode:
 *           type: string
 *         lectureMode:
 *           type: string
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student created successfully
 */
app.post('/students', async (req, res) => {
  const student = await Student.create(req.body);
  res.json(student);
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
