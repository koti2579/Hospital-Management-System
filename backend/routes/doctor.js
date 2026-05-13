const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const LabTest = require('../models/LabTest');

// Get assigned patients
router.get('/patients/:doctorId', async (req, res) => {
    try {
        const patients = await Patient.find({ 
            assignedDoctor: req.params.doctorId,
            status: { $in: ['registered', 'consulted'] }
        });
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit prescription
router.post('/prescribe', async (req, res) => {
    try {
        const { patientId, doctorId, medicines, instructions } = req.body;
        
        const prescription = new Prescription({
            patient: patientId,
            doctor: doctorId,
            medicines,
            instructions
        });

        await prescription.save();
        
        // Update patient status
        await Patient.findByIdAndUpdate(patientId, { status: 'prescribed' });
        
        res.json({ message: 'Prescription submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Request lab test
router.post('/request-test', async (req, res) => {
    try {
        const { patientId, doctorId, testName } = req.body;
        
        const labTest = new LabTest({
            patient: patientId,
            doctor: doctorId,
            testName
        });

        await labTest.save();
        res.json({ message: 'Lab test requested' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
