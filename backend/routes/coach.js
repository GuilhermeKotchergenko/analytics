const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const User = require('../models/User');
const Athlete = require('../models/Athlete');

// Middleware: auth and role('coach')
router.use(auth, role('coach'));

// Add an athlete to coach's list
router.post('/add-athlete', async (req, res) => {
    const { athleteEmail } = req.body;

    try {
        // Find athlete user
        const athleteUser = await User.findOne({ email: athleteEmail, role: 'athlete' });
        if (!athleteUser) return res.status(404).json({ msg: 'Athlete not found' });

        // Add athlete to coach's list
        await User.findByIdAndUpdate(req.user.id, { $addToSet: { athletes: athleteUser._id } });

        res.json({ msg: 'Athlete added' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get athletes data
router.get('/athletes', async (req, res) => {
    try {
        const coach = await User.findById(req.user.id).populate({
            path: 'athletes',
            populate: { path: 'athleteData' }
        });

        res.json(coach.athletes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
// Get athletes data
router.get('/athletes', async (req, res) => {
    try {
        const coach = await User.findById(req.user.id).populate({
            path: 'athletes',
            populate: {
                path: 'athleteData',
                model: 'Athlete'
            }
        });

        res.json(coach.athletes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Additional routes to manage athletes' data can be added here

module.exports = router;
