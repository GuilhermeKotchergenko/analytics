const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const coachRoute = require('./routes/coach');
const athleteRoute = require('./routes/athlete');
const paymentRoute = require('./routes/payment');

// Load environment variables
dotenv.config({ path: '../.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Simple route
app.get('/', (req, res) => {
    res.send('Fitness Analytics Backend');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// After other requires
const authRoute = require('./routes/auth');

// Use Routes
app.use('/api/auth', authRoute);
app.use('/api/coach', coachRoute);
app.use('/api/athlete', athleteRoute);
app.use('/api/payment', paymentRoute);