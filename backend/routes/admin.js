const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Create a new staff member
router.post('/add-staff', async (req, res) => {
    try {
        const { username, password, role, name, specialization } = req.body;
        
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            password: hashedPassword,
            role,
            name,
            specialization
        });

        await user.save();
        res.json({ message: 'Staff member added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all staff members
router.get('/staff', async (req, res) => {
    try {
        const staff = await User.find({ role: { $ne: 'admin' } }).select('-password');
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
