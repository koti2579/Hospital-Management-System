const express = require('express');
const router = express.Router();
const patientQueries = require('../config/queries/patientQueries');
const prescriptionQueries = require('../config/queries/prescriptionQueries');
const labTestQueries = require('../config/queries/labTestQueries');

// Get assigned patients
router.get('/patients/:doctorId', async (req, res) => {
    try {
        const patients = await patientQueries.getPatientsByDoctorAndStatus(
            req.params.doctorId, 
            ['registered', 'on_hold', 'ready_for_review']
        );
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get patient results
router.get('/patient-results/:patientId', async (req, res) => {
    try {
        const tests = await labTestQueries.getCompletedTestsByPatient(req.params.patientId);
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit prescription
router.post('/prescribe', async (req, res) => {
    try {
        const { patientId, doctorId, medicines, instructions } = req.body;
        const prescription = await prescriptionQueries.createPrescription({ patientId, doctorId, medicines, instructions });
        await patientQueries.updateStatus(patientId, 'consulted');
        res.status(201).json(prescription);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Request lab test
router.post('/request-test', async (req, res) => {
    try {
        const { patientId, doctorId, tests } = req.body; // 'tests' is now an array of strings
        
        const labTests = tests.map(testName => ({
            patientId,
            doctorId,
            testName
        }));
        
        await labTestQueries.createMany(labTests);
        await patientQueries.updateStatus(patientId, 'on_hold');
        
        res.status(201).json({ message: "Tests requested and patient put on hold" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
