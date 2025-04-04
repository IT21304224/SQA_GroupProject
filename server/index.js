require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Atlas Connected"))
.catch(err => console.error("❌ Error:", err));

// Schema for Marks
const marksSchema = new mongoose.Schema({
    name: String,
    marks: [Number]
});

const Marks = mongoose.model('Marks', marksSchema);

// Routes

// Add Marks
app.post('/api/marks', async (req, res) => {
    const { name, marks } = req.body;
    try {
        const newEntry = new Marks({ name, marks });
        await newEntry.save();
        res.status(201).send('Marks saved successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get Marks
app.get('/api/marks', async (req, res) => {
    try {
        const marks = await Marks.find();
        res.json(marks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
