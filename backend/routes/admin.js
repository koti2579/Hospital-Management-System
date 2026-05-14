const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const userQueries = require('../config/queries/userQueries');

const patientQueries = require('../config/queries/patientQueries');

// Get all staff members
router.get('/staff', async (req, res) => {
    try {
        const staff = await userQueries.getAllStaff();
        res.json(staff);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get admin stats
router.get('/stats', async (req, res) => {
    try {
        const totalPatients = await patientQueries.countPatients();
        const totalStaff = await userQueries.countStaff();
        
        // Group by gender
        const genderData = await patientQueries.aggregateByField("gender");

        // Group by status
        const statusData = await patientQueries.aggregateByField("status");

        res.json({
            totalPatients,
            totalStaff,
            genderDistribution: genderData,
            statusDistribution: statusData
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new staff member
router.post('/add-staff', async (req, res) => {
    try {
        const { username, password, role, name, specialization } = req.body;
        const normalizedRole = role === 'laboratory' ? 'lab' : role;
        const existingUser = await userQueries.findByUsername(username);
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        await userQueries.createUser({ username, password: hashedPassword, role: normalizedRole, name, specialization });
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
