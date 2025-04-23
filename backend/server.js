// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize Express app
const app = express();

// --- Middleware ---
// Enable CORS - Configure origins later for security
app.use(cors());

// Body Parser Middleware (built-in in Express)
// Allows us to accept JSON data in the request body
app.use(express.json());
// Allows us to accept data from forms (URL-encoded)
app.use(express.urlencoded({ extended: false }));

// --- API Routes ---
// Mount the student routes under the /api/students path
app.use('/api/students', studentRoutes);

// Basic route for testing if the server is running
app.get('/', (req, res) => {
  res.send('Student Form API Running');
});


// --- Start Server ---
const PORT = process.env.PORT || 5001; // Use port from .env or default to 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));