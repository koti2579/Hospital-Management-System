const express = require('express');
const router = express.Router();
const patientQueries = require('../config/queries/patientQueries');
const userQueries = require('../config/queries/userQueries');

// Register a patient
router.post('/register-patient', async (req, res) => {
    try {
        const newPatient = await patientQueries.registerPatient(req.body);
        res.status(201).json(newPatient);
    } catch (err) {
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
