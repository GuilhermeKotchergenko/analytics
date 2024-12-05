const mongoose = require('mongoose');

const AthleteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    externalLoad: [{
        date: Date,
        data: mongoose.Schema.Types.Mixed // Can be customized fields
    }],
    internalLoad: [{
        date: Date,
        sessionRPE: Number,
        duration: Number, // in minutes
        effortRPE: Number,
        repetitions: Number
    }],
    monotony: [{
        week: Number,
        year: Number,
        value: Number
    }],
    strain: [{
        week: Number,
        year: Number,
        value: Number
    }],
    wellBeing: [{
        date: Date,
        fatigue: Number,
        sleepQuality: Number,
        muscleSoreness: Number,
        stress: Number,
        mood: Number
    }],
    // Add more fields as needed
});

module.exports = mongoose.model('Athlete', AthleteSchema);
