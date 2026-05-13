const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const User = require('../models/User');

// Register a patient
router.post('/register-patient', async (req, res) => {
    try {
        const { name, age, gender, contact, temperature, symptoms, assignedDoctor } = req.body;
        
        const patient = new Patient({
            name,
            age,
            gender,
            contact,
            temperature,
            symptoms,
            assignedDoctor
        });

        await patient.save();
        res.json({ message: 'Patient registered successfully', patient });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all doctors for assignment
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('name specialization');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
