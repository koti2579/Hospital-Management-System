const express = require('express');
const router = express.Router();
const patientQueries = require('../config/queries/patientQueries');
const userQueries = require('../config/queries/userQueries');
const { verifyStaff } = require('../middleware/authMiddleware');

// All reception routes require staff authentication
router.use(verifyStaff);

// Register a patient
router.post('/register-patient', async (req, res) => {
    try {
        // Ensure role is reception or admin
        if (req.user.role !== 'reception' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Reception access only' });
        }
        const newPatient = await patientQueries.registerPatient(req.body);
        res.status(201).json(newPatient);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Phone number already registered' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Get all patients
router.get('/patients', async (req, res) => {
    try {
        const patients = await patientQueries.getAllPatients();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all doctors for assignment
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await userQueries.getAllDoctors();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
