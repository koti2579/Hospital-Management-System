const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        console.log('--- Login Attempt ---');
        console.log('Body:', { username, role });
        
        if (!username || !password || !role) {
            console.log('Missing fields');
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const user = await User.findOne({ username, role });
        console.log('User search result:', user ? 'User found' : 'User NOT found');

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials or role' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                name: user.name
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
