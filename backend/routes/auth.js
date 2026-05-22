const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userQueries = require('../config/queries/userQueries');
const patientQueries = require('../config/queries/patientQueries');

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userQueries.findByUsername(username);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username, role: user.role, name: user.name } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Patient Login Route (Phone number only)
router.post('/patient-login', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) return res.status(400).json({ message: 'Phone number is required' });

        const patient = await patientQueries.findByPhoneNumber(phoneNumber);
        
        // Use generic error message to avoid enumeration
        if (!patient) return res.status(401).json({ message: 'Invalid phone number' });

        const token = jwt.sign(
            { patientId: patient._id, role: 'patient' }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '24h' }
        );

        // Set HTTP-only cookie
        res.cookie('patientToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({ 
            message: 'Login successful',
            patient: { 
                id: patient._id, 
                name: patient.name,
                role: 'patient'
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
