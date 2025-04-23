require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { body, validationResult } = require('express-validator'); // Validation library
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Atlas Connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Mongoose Schema & Model
const marksSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    marks: [
        {
            subject: {
                type: String,
                required: true,
                trim: true
            },
            mark: {
                type: Number,
                required: true,
                min: 0,
                max: 100
            }
        }
    ]
});

const Marks = mongoose.model('Marks', marksSchema);

// ✅ Routes

// Create new marks entry
app.post('/api/marks', 
    // Validation middleware
    body('studentId').notEmpty().withMessage('Student ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('marks').isArray().withMessage('Marks should be an array'),
    body('marks.*.subject').notEmpty().withMessage('Subject name is required for each mark entry'),
    body('marks.*.mark').isInt({ min: 0, max: 100 }).withMessage('Mark should be between 0 and 100'),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { studentId, name, marks } = req.body;
        try {
            const newEntry = new Marks({ studentId, name, marks });
            await newEntry.save();
            res.status(201).send('Marks saved successfully');
        } catch (error) {
            res.status(400).send(`Error: ${error.message}`);
        }
    }
);

// Get all marks entries
app.get('/api/marks', async (req, res) => {
    try {
        const allMarks = await Marks.find();
        res.json(allMarks);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

// Update a marks entry by ID
app.put('/api/marks/:id', 
    // Validation middleware
    body('studentId').notEmpty().withMessage('Student ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('marks').isArray().withMessage('Marks should be an array'),
    body('marks.*.subject').notEmpty().withMessage('Subject name is required for each mark entry'),
    body('marks.*.mark').isInt({ min: 0, max: 100 }).withMessage('Mark should be between 0 and 100'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { studentId, name, marks } = req.body;
        try {
            await Marks.findByIdAndUpdate(id, { studentId, name, marks });
            res.send('Marks updated successfully');
        } catch (error) {
            res.status(400).send(`Error: ${error.message}`);
        }
    }
);

// Delete a marks entry by ID
app.delete('/api/marks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Marks.findByIdAndDelete(id);
        res.send('Marks deleted successfully');
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
