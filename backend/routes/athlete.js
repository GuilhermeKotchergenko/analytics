const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Athlete = require('../models/Athlete');
const User = require('../models/User');

// Middleware: auth and role('athlete')
router.use(auth, role('athlete'));

// Initialize athlete data if not exists
router.use(async (req, res, next) => {
    try {
        let athleteData = await Athlete.findOne({ user: req.user.id });
        if (!athleteData) {
            athleteData = new Athlete({ user: req.user.id });
            await athleteData.save();

            // Link athlete data to user
            await User.findByIdAndUpdate(req.user.id, { athleteData: athleteData._id });
        }
        req.athleteData = athleteData;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Input external load data
router.post('/external-load', async (req, res) => {
    const { data } = req.body; // data is a string or object
    try {
        req.athleteData.externalLoad.push({ date: new Date(), data });
        await req.athleteData.save();
        res.json({ msg: 'External load data added' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Input internal load data
router.post('/internal-load', async (req, res) => {
    const { sessionRPE, duration, effortRPE, repetitions } = req.body;
    try {
        req.athleteData.internalLoad.push({
            date: new Date(),
            sessionRPE,
            duration,
            effortRPE,
            repetitions
        });
        await req.athleteData.save();
        res.json({ msg: 'Internal load data added' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Input well-being data
router.post('/well-being', async (req, res) => {
    const { fatigue, sleepQuality, muscleSoreness, stress, mood } = req.body;
    try {
        req.athleteData.wellBeing.push({
            date: new Date(),
            fatigue,
            sleepQuality,
            muscleSoreness,
            stress,
            mood
        });
        await req.athleteData.save();
        res.json({ msg: 'Well-being data added' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Additional routes can be added here
// Get athlete data
router.get('/data', async (req, res) => {
    try {
        const athleteData = await Athlete.findOne({ user: req.user.id });

        // Calculate monotony and strain
        const internalLoads = athleteData.internalLoad;

        // Group internal loads by week
        const weeklyLoads = {};

        internalLoads.forEach((load) => {
            const date = new Date(load.date);
            const week = getWeekNumber(date);
            const year = date.getFullYear();
            const key = `${year}-W${week}`;

            if (!weeklyLoads[key]) {
                weeklyLoads[key] = [];
            }
            weeklyLoads[key].push(load.sessionRPE * load.duration);
        });

        const monotonyStrain = [];

        Object.keys(weeklyLoads).forEach((key) => {
            const loads = weeklyLoads[key];
            const totalLoad = loads.reduce((a, b) => a + b, 0);
            const avgLoad = totalLoad / loads.length;
            const loadSD = standardDeviation(loads);
            const monotony = loadSD !== 0 ? avgLoad / loadSD : 0;
            const strain = totalLoad * monotony;

            monotonyStrain.push({
                week: key,
                totalLoad,
                monotony,
                strain
            });
        });

        res.json({
            ...athleteData._doc,
            monotonyStrain
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Helper functions
function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function standardDeviation(values) {
    const avg = average(values);
    const squareDiffs = values.map(value => {
        const diff = value - avg;
        return diff * diff;
    });
    const avgSquareDiff = average(squareDiffs);
    return Math.sqrt(avgSquareDiff);
}

function average(data) {
    const sum = data.reduce((sum, value) => sum + value, 0);
    return sum / data.length;
}

module.exports = router;
