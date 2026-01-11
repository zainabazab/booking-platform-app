const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// To allow requests from your React development server (port 5173)
app.use(cors({
    origin: 'http://localhost:5173', // <-- Specify the frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true, // Allow cookies/authorization headers
}));

// Middleware
app.use(express.json()); // Allows us to get data in JSON format

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
// We will add the booking routes here next:
 app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Booking Platform API is running!');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));