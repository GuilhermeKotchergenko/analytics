const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['coach', 'athlete'],
        required: true,
        default: 'athlete'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    athletes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // References other users (athletes)
    }],
    athleteData: { // New reference field to Athlete model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Athlete'
    },
    isPremium: {
        type: Boolean,
        default: false
    },

    // Add other fields as needed
});

module.exports = mongoose.model('User', UserSchema);
