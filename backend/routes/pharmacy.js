const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');

// Get all pending prescriptions
router.get('/prescriptions', async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ status: 'pending' })
            .populate('patient', 'name age gender')
            .populate('doctor', 'name');
        res.json(prescriptions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Issue medicines
router.post('/issue/:prescriptionId', async (req, res) => {
    try {
        await Prescription.findByIdAndUpdate(req.params.prescriptionId, { status: 'issued' });
        res.json({ message: 'Medicines issued successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
