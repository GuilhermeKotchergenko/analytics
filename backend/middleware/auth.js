const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        // Fetch user role from DB
        const user = await User.findById(req.user.id);
        req.user.role = user.role;

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}
