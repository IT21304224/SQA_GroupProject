require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Atlas Connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

/* ======== SCHEMAS ======== */
// Student Schema
const Student = mongoose.model('Student', {
    name: String,
    email: String,
    course: String,
    deliveryMode: String,
    lectureMode: String
});

// Marks Schema
const marksSchema = new mongoose.Schema({
    studentId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    marks: [
        {
            subject: { type: String, required: true, trim: true },
            mark: { type: Number, required: true, min: 0, max: 100 }
        }
    ]
});
const Marks = mongoose.model('Marks', marksSchema);

/* ======== STUDENT ROUTES ======== */
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).send("Error fetching students");
    }
});

app.post('/api/students', async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.json(student);
    } catch (err) {
        res.status(500).send("Error creating student");
    }
});

app.put('/api/students/:id', async (req, res) => {
    try {
        const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).send("Error updating student");
    }
});

app.delete('/api/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send("Error deleting student");
    }
});

/* ======== MARKS ROUTES ======== */
app.post('/api/marks',
    body('studentId').notEmpty().withMessage('Student ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('marks').isArray().withMessage('Marks should be an array'),
    body('marks.*.subject').notEmpty().withMessage('Subject name is required'),
    body('marks.*.mark').isInt({ min: 0, max: 100 }).withMessage('Mark should be between 0 and 100'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newEntry = new Marks(req.body);
            await newEntry.save();
            res.status(201).send('Marks saved successfully');
        } catch (error) {
            res.status(400).send(`Error: ${error.message}`);
        }
    });

app.get('/api/marks', async (req, res) => {
    try {
        const allMarks = await Marks.find();
        res.json(allMarks);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.put('/api/marks/:id',
    body('studentId').notEmpty().withMessage('Student ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('marks').isArray().withMessage('Marks should be an array'),
    body('marks.*.subject').notEmpty().withMessage('Subject name is required'),
    body('marks.*.mark').isInt({ min: 0, max: 100 }).withMessage('Mark should be between 0 and 100'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            await Marks.findByIdAndUpdate(req.params.id, req.body);
            res.send('Marks updated successfully');
        } catch (error) {
            res.status(400).send(`Error: ${error.message}`);
        }
    });

app.delete('/api/marks/:id', async (req, res) => {
    try {
        await Marks.findByIdAndDelete(req.params.id);
        res.send('Marks deleted successfully');
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

/* ======== SWAGGER SETUP (for Student API) ======== */
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Student API',
            version: '1.0.0',
            description: 'API for managing student records',
        },
        servers: [
            { url: `http://localhost:${PORT}` }
        ],
    },
    apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ======== START SERVER ======== */
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
