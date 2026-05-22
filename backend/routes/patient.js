const express = require('express');
const router = express.Router();
const { verifyPatient } = require('../middleware/authMiddleware');
const patientQueries = require('../config/queries/patientQueries');
const prescriptionQueries = require('../config/queries/prescriptionQueries');
const labTestQueries = require('../config/queries/labTestQueries');

// All routes here are protected and restricted to the logged-in patient
router.use(verifyPatient);

// Get patient's own profile details
router.get('/profile', async (req, res) => {
    try {
        const patient = await patientQueries.getPatientById(req.patientId);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get patient's own prescriptions
router.get('/prescriptions', async (req, res) => {
    try {
        const prescriptions = await prescriptionQueries.getPrescriptionsByPatient(req.patientId);
        res.json(prescriptions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get patient's own lab tests
router.get('/lab-tests', async (req, res) => {
    try {
        const labTests = await labTestQueries.getAllTestsByPatient(req.patientId);
        res.json(labTests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
